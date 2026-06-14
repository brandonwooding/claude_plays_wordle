from gameplay_scripts import paths
import argparse
import json

def load_run(path):
    with open(path) as f:
        return [json.loads(line) for line in f]

def build_summary(messages):
    plays = []
    thinking_buffer = []
    tool_id_map = {}  # tool_use_id -> (play_index, "result" | "result_details")
    usage = None

    for d in messages:
        if d["_type"] == "AssistantMessage":
            for block in d["content"]:

                if block["_type"] == "ThinkingBlock":
                    thinking_buffer.append(block["thinking"])

                elif block["_type"] == "ToolUseBlock":
                    if block["name"] == "mcp__wordle__play_word":
                        plays.append({
                            "thinking": "\n\n".join(thinking_buffer),
                            "guess": block["input"]["word"],
                            "result": None,
                            "result_details": None,
                        })
                        tool_id_map[block["id"]] = (len(plays) - 1, "result")

                    elif block["name"] == "mcp__wordle__get_game_state":
                        if plays:  # ignore any pre-game state checks
                            tool_id_map[block["id"]] = (len(plays) - 1, "result_details")

                    thinking_buffer = []

        elif d["_type"] == "UserMessage":
            for block in d["content"]:
                if block["_type"] == "ToolResultBlock":
                    tool_use_id = block["tool_use_id"]
                    if tool_use_id in tool_id_map:
                        content = block["content"]
                        text = content[0]["text"] if isinstance(content, list) else str(content)

                        play_idx, field = tool_id_map[tool_use_id]
                        plays[play_idx][field] = text

        elif d["_type"] == "ResultMessage":
            usage = {
                "total_cost_usd": d["total_cost_usd"],
                "duration_ms": d["duration_ms"],
                "num_turns": d["num_turns"],
                "tokens": d["usage"],
            }

    game_outcome = dict()

    last_play = plays[-1]
    last_result = json.loads(last_play["result"])

    game_outcome["win"] = (
        last_result["response"].startswith("Correct guess")
        or last_play["result_details"] is None
    )
    game_outcome["attempts"] = len(plays)

    return {"game_outcome": game_outcome, "plays": plays, "usage": usage}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True, help="Model id used for the run, e.g. claude-sonnet-4-6")
    args = parser.parse_args()

    run_dir = paths.get_run_dir(model_id=args.model, create=True)
    messages = load_run(run_dir / paths.get_log_filename(model_id=args.model))
    summary = build_summary(messages)
    with open(run_dir / "summary.json", "w") as file:
        file.write(json.dumps(summary, indent=2))