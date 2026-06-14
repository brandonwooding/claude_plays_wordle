import sqlite3
import os
import json
from pathlib import Path
from gameplay_scripts import paths

top_folder = paths.DATA_DIR
summary_file = "summary.json"
reflection_file = "reflection.json"
db_path = paths.GAMEPLAY_ROOT / "database" / "wordle_ai_database.db"

# Build history

all_results = []

for day in os.scandir(top_folder):
    if not day.is_dir():
        continue

    for model in os.scandir(day.path):
        if not model.is_dir():
            continue

        model_dir = Path(model.path)
        summary_path = model_dir / summary_file

        if not summary_path.exists():
            continue

        with open(summary_path) as f:
            summary_data = json.load(f)

        plays = summary_data["plays"]

        game_results = dict()
        game_results["date"] = day.name
        game_results["model"] = model.name
        game_results["attempts"] = summary_data["game_outcome"]["attempts"]
        game_results["win"] = summary_data["game_outcome"]["win"]
        game_results["duration_ms"] = summary_data["usage"]["duration_ms"]
        game_results["cost_usd"] = summary_data["usage"]["total_cost_usd"]

        for attempt in range(1, 7):
            if attempt <= len(plays):
                play = plays[attempt - 1]
                game_results[f"guess_{attempt}"] = play["guess"]
                game_results[f"guess_{attempt}_thinking"] = play["thinking"]

                if play["result_details"] is not None:
                    result_details = json.loads(play["result_details"])
                    letter_tiles = result_details[f"row-{attempt}"]["letter_tiles"]
                else:
                    # Winning guess - board state wasn't re-fetched, so treat
                    # every letter as correct.
                    letter_tiles = [{"letter": letter, "state": "correct"} for letter in play["guess"]]

                for letter in range(1, 6):
                    tile = letter_tiles[letter - 1]
                    game_results[f"guess_{attempt}_letter_{letter}"] = tile["letter"]
                    game_results[f"guess_{attempt}_letter_{letter}_result"] = tile["state"]
            else:
                game_results[f"guess_{attempt}"] = None
                game_results[f"guess_{attempt}_thinking"] = None

                for letter in range(1, 6):
                    game_results[f"guess_{attempt}_letter_{letter}"] = None
                    game_results[f"guess_{attempt}_letter_{letter}_result"] = None

        reflection_path = model_dir / reflection_file
        if reflection_path.exists():
            with open(reflection_path) as f:
                reflection_data = json.load(f)
            reflections = reflection_data.get("reflection", [])
            game_results["reflection"] = reflections[-1] if reflections else None
        else:
            game_results["reflection"] = None

        all_results.append(game_results)

# Create SQLite database

columns = ["date", "model", "attempts", "win", "duration_ms", "cost_usd"]
for n in range(1, 7):
    columns += [f"guess_{n}", f"guess_{n}_thinking"]
    for l in range(1, 6):
        columns += [f"guess_{n}_letter_{l}", f"guess_{n}_letter_{l}_result"]
columns.append("reflection")

column_types = {
    "attempts": "INTEGER",
    "win": "INTEGER",
    "duration_ms": "INTEGER",
    "cost_usd": "REAL",
}

# Wipe and recreate the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS game_results")

column_defs = ", ".join(f"{col} {column_types.get(col, 'TEXT')}" for col in columns)
cursor.execute(f"""
    CREATE TABLE game_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        {column_defs}
    )
""")

placeholders = ", ".join(f":{col}" for col in columns)
cursor.executemany(
    f"INSERT INTO game_results ({', '.join(columns)}) VALUES ({placeholders})",
    all_results
)

conn.commit()
conn.close()
