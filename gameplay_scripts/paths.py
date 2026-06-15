from pathlib import Path
from datetime import date

GAMEPLAY_ROOT = Path(__file__).resolve().parent
REPO_ROOT = GAMEPLAY_ROOT.parent

AGENTS_DIR = GAMEPLAY_ROOT / "agents"
TOOLS_DIR = GAMEPLAY_ROOT / "tools"
DATA_DIR = GAMEPLAY_ROOT / "data"

WORDLE_AGENT_DIR = AGENTS_DIR / "wordle-agent"
REFLECTION_AGENT_DIR = AGENTS_DIR / "reflection-agent"

MODEL_STRATEGY_DIR = TOOLS_DIR / "model-strategy"


def today_str():
    return date.today().strftime("%Y-%m-%d")


def get_run_dir(model_id, date_str=None, create=False):
    date_str = date_str or today_str()
    run_dir = DATA_DIR / date_str / model_id
    if create:
        run_dir.mkdir(parents=True, exist_ok=True)
    return run_dir


def get_log_filename(model_id, date_str=None):
    date_str = date_str or today_str()
    return f"{date_str}_{model_id}.jsonl"


def get_strategy_path(model_id, create=False):
    strategy_dir = MODEL_STRATEGY_DIR / model_id
    if create:
        strategy_dir.mkdir(parents=True, exist_ok=True)
    return strategy_dir / "wordle-strategy.md"
