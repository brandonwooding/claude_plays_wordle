from gameplay_scripts.tools.browser_manager import BrowserManager
from gameplay_scripts.tools.tools import make_wordle_tools, list_playable_words, serialize_message, get_log_name
import asyncio
import json
import os
import frontmatter
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from claude_agent_sdk import query, ClaudeAgentOptions, create_sdk_mcp_server, ClaudeSDKClient, AgentDefinition
from claude_agent_sdk import (
    AssistantMessage,
    UserMessage,
    ResultMessage,
    TextBlock,
    ThinkingBlock,
    ToolUseBlock,
    ToolResultBlock,
)


async def main():
    # Open site
    driver = BrowserManager.get_driver()
    driver.get("https://www.nytimes.com/games/wordle")

    # Close privacy modal
    wait = WebDriverWait(driver, 10)

    button = wait.until(
        EC.element_to_be_clickable(
            (By.CSS_SELECTOR, "#fides-banner button.fides-accept-all-button")
        )
    )

    button.click()

    # Click Play
    button = wait.until(
        EC.element_to_be_clickable(
            (By.CSS_SELECTOR, 'button[data-testid="Play"]')
        )
    )

    button.click()

    # Close 'How to Play' modal
    try:
        button = wait.until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, 'button[aria-label="Close"]')
            )
        )

        button.click()

    except TimeoutException:
        print("no 'how to'")

    # Load word list
    word_lookup = list_playable_words()

    # Load prompts
    # Main Agent
    post = frontmatter.load("wordle-agent.md")
    agent_details = post.metadata
    system_prompt = post.content
    model = agent_details["model"]

    # Strategy Reviewer Sub Agent
    strategy_reviewer_post = frontmatter.load("wordle-strategist.md")
    strategy_agent_details = strategy_reviewer_post.metadata
    strategy_agent_system_prompt = strategy_reviewer_post.content

    with open("wordle-strategy.md") as f:
        game_strategy = f.read()

    # Set log file
    log_file = f"data/{datetime.today().strftime('%Y-%m-%d')}/{get_log_name(model_id=model)}"
    os.makedirs(os.path.dirname(log_file), exist_ok=True)

    # MCP tools server
    server = create_sdk_mcp_server(
        name="wordle-tools",
        version="1.0.0",
        tools=make_wordle_tools(driver, word_lookup)
    )

    # Agent Config
    options = ClaudeAgentOptions(
        model=model,
        system_prompt=f"{system_prompt} \n {game_strategy}",
        mcp_servers={"wordle": server},
        allowed_tools=["mcp__wordle__get_game_state", "mcp__wordle__play_Word"]
    )

    # AGENT LOOP

    async with ClaudeSDKClient(options=options) as client:
        await client.query("Play today's Wordle. Use get_game_state to check the board and play_word to submit guesses.")
        
        # Logging
        with open(log_file, "w") as f:
            async for msg in client.receive_response():

                f.write(json.dumps(serialize_message(msg)) + "\n")

                if isinstance(msg, AssistantMessage):
                    for block in msg.content:
                        if isinstance(block, ThinkingBlock):
                            print(f"\nTHINKING:\n{block.thinking}\n")
                        elif isinstance(block, TextBlock):
                            print(f"SPEAKING {block.text}")
                        elif isinstance(block, ToolUseBlock):
                            print(f"TOOL CALL: {block.name}({block.input})")

                elif isinstance(msg, UserMessage):
                    for block in msg.content:
                        if isinstance(block, ToolResultBlock):
                            content = block.content
                            if isinstance(content, list):
                                text = content[0].get('text', str(content[0]))
                            else:
                                text = str(content)
                            print(f"TOOL RESULT: {text}")

                elif isinstance(msg, ResultMessage):
                    print(f"\nDONE — {msg.num_turns} turns, ${msg.total_cost_usd:.4f}, {msg.duration_ms}ms")

    BrowserManager.quit_driver()


asyncio.run(main())