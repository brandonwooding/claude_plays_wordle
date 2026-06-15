# Wordle Game Strategy

- The first guess can be useful to explore vowels and common consonants
- After the first guess, minimise guesses that are completely exploratory
- When an incorrect letter is guessed, don't use it again
- When a correct letter is guessed in the wrong place, subsequent guesses should include it in a different place
- When a correct letter is guessed in the right place, keep guessing words that contain that letter in that placement

## Before choosing the next guess

- Explicitly restate the current constraints first: a slot-by-slot pattern (e.g. `B R _ I L`) showing known-correct letters, a list of letters known to be "present but in a different position" along with the positions they've been ruled out of, and a list of fully absent letters
- Only consider candidate words that satisfy ALL of these constraints simultaneously - don't propose a word that contains an already-eliminated letter, even while brainstorming
- If most of the pattern is known (3+ letters fixed), search systematically through common English words matching that pattern rather than free-associating one-off words. Stop as soon as a valid word matching all constraints is found - don't keep rejecting and second-guessing it
- If brainstorming stalls (many consecutive invalid/non-words), step back and try filling the unknown slot(s) with the next most common letters for that slot (vowels O/U/Y, or common consonants) rather than repeatedly retrying words containing eliminated letters
- Avoid lengthy looping reasoning chains that repeatedly propose and reject the same or similar invalid words - this wastes effort without narrowing the search