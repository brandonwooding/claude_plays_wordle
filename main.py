from browser_manager import BrowserManager
from tools.tools import get_game_state
import asyncio
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pprint import pprint

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
button = wait.until(
    EC.element_to_be_clickable(
        (By.CSS_SELECTOR, 'button[aria-label="Close"]')
    )
)

button.click()

# Agent Loop

pprint(get_game_state(driver))


input("we did it - click")

BrowserManager.quit_driver()