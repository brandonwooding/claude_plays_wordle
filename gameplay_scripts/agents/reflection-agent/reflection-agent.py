from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock, ClaudeSDKClient
import frontmatter
import json
import asyncio

async def main():
        
    # load summary
    with open("data/2026-06-12/summary.json") as f:
        game_summary = json.load(f)

    post = frontmatter.load("wordle-strategist.md")
    system_prompt = post.content

    review_options = ClaudeAgentOptions(
        model="claude-sonnet-4-6",
        system_prompt=system_prompt,
        allowed_tools=["Read", "Edit"],
        cwd="/Users/brandonwooding/Documents/04-Personal-Technical/2025-Projects/csdk-wordle"
    )

    review_prompt = f"""Here is the summary of the most recent game:

    {game_summary["plays"]}

    Review wordle-strategy.md and revise as necessary."""

    async for message in query(prompt=review_prompt, options=review_options):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)

asyncio.run(main())