# Wordle Game Strategy

## Opening Guesses

- The first guess should maximise coverage of common vowels and consonants (e.g. SLATE, CRANE, AUDIO)
- The second guess, if still exploratory, should use **5 entirely new letters** — no overlap with any letter already guessed, regardless of their feedback state. This maximises information across the first two guesses
- After two guesses, shift to exploiting known constraints rather than continuing pure exploration

## Reading Feedback Correctly

Valid letter states after a guess are:
- `correct` — right letter, right position (green)
- `present` — right letter, wrong position (yellow)
- `absent` — letter not in the word (gray)

**If any letter shows `tbd` (to be determined) after a guess has been accepted, that is a feedback failure — not a valid game state.** Do not interpret `tbd` as `absent` or any other outcome. Do not continue guessing as if that feedback were valid. Acknowledge the anomaly explicitly before proceeding.

## Before Choosing the Next Guess

- Explicitly restate the current constraints first: a slot-by-slot pattern (e.g. `B R _ I L`) showing known-correct letters, a list of letters known to be "present but in a different position" along with the positions they've been ruled out of, and a list of fully absent letters
- Only consider candidate words that satisfy **all** constraints simultaneously — never propose a word containing an already-eliminated letter, even while brainstorming
- If most of the pattern is known (3+ letters fixed), search systematically through common English words matching that pattern rather than free-associating. Stop as soon as a valid word matching all constraints is found
- If brainstorming stalls, try filling unknown slots with the next most common letters for that position (vowels O/U/Y, common consonants R/N/T) rather than retrying words with eliminated letters
- Avoid lengthy looping reasoning chains that repeatedly propose and reject the same or similar invalid words

## Applying Constraints

- When a letter is `absent`, never use it again
- When a letter is `present`, include it in every subsequent guess — but not in any position it has already been ruled out of
- When a letter is `correct`, keep it in that exact position in every subsequent guess

## Handling Broken or Missing Feedback

- If the board state does not update after a guess (rows remain empty or show unexpected states like `tbd`), treat all prior guesses as having produced **no usable information**
- In this situation, continue with guesses that maximise new letter coverage using the most common English letters not yet tested, rather than guessing based on phantom constraints
- Do not guess words that reuse letters from previous guesses when the outcome of those guesses is unknown