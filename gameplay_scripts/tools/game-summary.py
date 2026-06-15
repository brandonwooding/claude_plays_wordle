from gameplay_scripts import paths
import argparse
import json

INVALID_WORD_MESSAGE = "Invalid word guessed - please guess a real 5-letter word"

def load_run(path):
    with open(path) as f:
        return [json.loads(line) for line in f]

def get_tool_result_text(block):
    content = block["content"]
    if isinstance(content, list):
        return content[0]["text"]
    return str(content)

def build_summary(messages):
    plays = []
    thinking = ""
    tool_id_map = {}  # tool_use_id -> (play, "result" | "result_details")
    usage = None

    for d in messages:
        if d["_type"] == "AssistantMessage":
            for block in d["content"]:

                if block["_type"] == "ThinkingBlock":
                    thinking = block["thinking"]

                elif block["_type"] == "TextBlock":
                    thinking = block["text"]

                elif block["_type"] == "ToolUseBlock":
                    if block["name"] == "mcp__wordle__play_word":
                        play = {
                            "thinking": thinking,
                            "guess": block["input"]["word"],
                            "result": None,
                            "result_details": None,
                        }
                        plays.append(play)
                        tool_id_map[block["id"]] = (play, "result")

                    elif block["name"] == "mcp__wordle__get_game_state":
                        if plays:  # ignore any pre-game state checks
                            tool_id_map[block["id"]] = (plays[-1], "result_details")

                    thinking = ""

        elif d["_type"] == "UserMessage":
            for block in d["content"]:
                if block["_type"] == "ToolResultBlock":
                    tool_use_id = block["tool_use_id"]
                    if tool_use_id in tool_id_map:
                        text = get_tool_result_text(block)

                        play, field = tool_id_map[tool_use_id]
                        if field == "result" and INVALID_WORD_MESSAGE in text:
                            plays.remove(play)
                            continue

                        play[field] = text

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
