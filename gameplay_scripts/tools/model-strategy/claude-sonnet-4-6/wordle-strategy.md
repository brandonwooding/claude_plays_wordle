# Wordle Game Strategy

- The first guess can be useful to explore vowels and common consonants
- After the first guess, minimise guesses that are completely exploratory
- When an incorrect letter is guessed, don't use it again
- When a correct letter is guessed in the wrong place, subsequent guesses should include it in a different place, but explicitly rule out the position(s) where it has already been tried
- When a correct letter is guessed in the right place, keep guessing words that contain that letter in that placement
- Build a running list of confirmed-absent letters and avoid them in all future guesses, even if it means picking a less common word
- For the second guess, prefer a word that locks in any already-confirmed letters/positions while testing fresh, high-frequency letters (especially vowels) in the remaining unknown slots - this narrows the search space quickly without wasting a guess