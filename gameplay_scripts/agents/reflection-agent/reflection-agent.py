from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock, ClaudeSDKClient
from gameplay_scripts import paths
import argparse
import frontmatter
import json
import asyncio

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True, help="Model id used for the run, e.g. claude-sonnet-4-6")
    args = parser.parse_args()

    run_dir = paths.get_run_dir(model_id=args.model, create=True)

    # load summary
    with open(run_dir / "summary.json") as f:
        game_summary = json.load(f)

    post = frontmatter.load(paths.REFLECTION_AGENT_DIR / "wordle-strategist.md")
    system_prompt = post.content

    review_options = ClaudeAgentOptions(
        model="claude-sonnet-4-6",
        system_prompt=system_prompt,
        allowed_tools=["Read", "Edit"],
        cwd=str(paths.REPO_ROOT)
    )

    strategy_path = paths.TOOLS_DIR.relative_to(paths.REPO_ROOT) / "wordle-strategy.md"

    review_prompt = f"""Here is the summary of the most recent game:

    {game_summary["plays"]}

    Review {strategy_path} and revise as necessary."""

    review_texts = []

    async for message in query(prompt=review_prompt, options=review_options):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text)
                    review_texts.append(block.text)

    with open(run_dir / "reflection.json", "w") as f:
        json.dump({"reflection": review_texts}, f, indent=2)

asyncio.run(main())
