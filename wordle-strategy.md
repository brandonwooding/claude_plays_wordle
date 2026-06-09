# Wordle Strategy

- The first guess can be useful to explore vowels
- After the first guess, minimise guesses that are completely exploratory
- When an incorrect letter is guessed, don't use it again
- When a correct letter is guessed in the wrong place, subsequent guesses should include it in a different place
- When a correct letter is guessed in the right place, keep guessing words that contain that letter in that placement