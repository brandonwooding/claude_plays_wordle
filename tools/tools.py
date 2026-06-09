from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from claude_agent_sdk import tool, create_sdk_mcp_server


def format_dict_key(str):
    return str.replace(' ', '-').lower()

@tool(
        "get_game_state",
        "Returns the current state of the world game board",
        {}
)
def get_game_state(driver):
    """
    Returns the current state of a Wordle game as a dictionary.
    Useful for planning next guess, and determining if game is complete.
    """

    game = driver.find_element(By.ID, "wordle-app-game")

    row_elements = game.find_elements(
        By.CSS_SELECTOR,
        'div[role="group"][aria-label^="Row"]'
    )

    rows = dict()

    for row_element in row_elements:
        row_label = row_element.get_attribute("aria-label")

        tile_elements = row_element.find_elements(
            By.CSS_SELECTOR,
            'div[aria-roledescription="tile"]'
        )

        tiles = []

        for tile_element in tile_elements:
            tiles.append({
                "letter": tile_element.text,
                "state": tile_element.get_attribute("data-state"),
                "description": tile_element.get_attribute("aria-label"),
            })

        guess = "".join([tile["letter"] for tile in tiles])
        if guess == "":
            guess = None

        guess_outcome = None
        if guess:
            guesses_correct = [tile["state"] == "correct" for tile in tiles]
            if all(guesses_correct):
                guess_outcome = "correct"
            elif any(guesses_correct):
                guess_outcome = "partially correct"
            else:
                guess_outcome = "incorrect"
            

        rows[format_dict_key(row_label)] = {
            "guess": guess,
            "guess_outcome": guess_outcome,
            "letter_tiles": tiles,
        }
    
    return rows

def list_playable_words(filename="tools/valid-wordle-words.txt"):
    with open(filename, "r") as f:
        word_list = f.read().splitlines()
        word_lookup = {word: True for word in word_list}

    return word_lookup

def get_game_toast_message(driver, timeout=5):
    wait = WebDriverWait(driver, timeout)

    toast = wait.until(
        lambda d: (
            element
            if (element := d.find_element(
                By.CSS_SELECTOR,
                '[id^="ToastContainer-module_gameToaster"]'
            )).text.strip()
            else False
        )
    )

    return toast.text.strip()

def play_word(driver, word, word_lookup):
    """
    Checks if word is valid.
    Submits valid word to game.
    Checks for any errors in game accepting word.
    """

    # Check if word is valid against wordlist
    if not word_lookup.get(word):
        raise ValueError("Invalid word guessed - please guess a real 5-letter word")
    
    # Submit word to game
    body = driver.find_element(By.TAG_NAME, "body")
    body.click()

    body.send_keys(word)
    # await asyncio.sleep(0.5) 
    body.send_keys(Keys.ENTER)

    # Immediately get feedback from game
    toast_message = get_game_toast_message(driver)

    return {"guess": word, "response": toast_message}

