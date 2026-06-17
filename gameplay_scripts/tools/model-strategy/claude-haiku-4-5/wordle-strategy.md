# Wordle Game Strategy

## Opening Guesses

- The first guess should maximise coverage of common vowels and consonants (e.g. SLATE, CRANE, AUDIO)
- The second guess depends on what was learned from the first:
  - **If guess 1 revealed 0–1 useful letters total (correct + present)**: use **5 entirely new letters** for pure exploration (e.g. RHINO after SLATE with no hits). Maximise information across the first two guesses
  - **If guess 1 revealed 0 correct positions but 2+ present (yellow) letters**: choose a word that **re-uses those yellow letters in new valid positions** while also testing as many new letters as possible. For example, after SLATE gives T🟡 E🟡, prefer INTER (places T at pos 3, E at pos 4; also tests I, N, R) over a pure exploration word. This turns yellow tiles into green confirmation a guess earlier — a significant acceleration
  - **If guess 1 revealed 2+ correct (green) positions**: shift immediately to pattern-fitting guesses that *also* use new letters. Do not waste a full guess on a word that cannot match the known pattern. For example, if `_ _ A _ E` is known after guess 1, prefer BRAVE, DRAPE, or GRAZE over RHINO — they test similar new letters while remaining valid candidates
- After two guesses, shift fully to exploiting known constraints rather than continuing pure exploration

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
- If brainstorming stalls, try filling unknown slots with the next most common letters for that position (vowels O/U/Y, common consonants B/D/F/G/M/V/W) rather than retrying words with eliminated letters
- Remember to consider **double-letter words** (e.g. AMAZE, ABBEY, LLAMA) when heavy elimination has narrowed the candidate pool — uncommon structures become more likely when common letters are exhausted
- Avoid lengthy looping reasoning chains that repeatedly propose and reject the same or similar invalid words

## Applying Constraints

- When a letter is `absent`, never use it again
- When a letter is `present`, include it in every subsequent guess — but not in any position it has already been ruled out of
- When a letter is `correct`, keep it in that exact position in every subsequent guess

## Pattern-Aware Exploration

When a strong pattern is known early (e.g. 2+ correct positions after guess 1):
- Prioritise candidate words that **fit the known pattern** over pure exploration words
- Within those candidates, prefer words that test as many untried letters as possible
- This avoids spending entire guesses on words that, even if perfectly informative about absent letters, can never be the answer — wasting a precious turn

## Handling Broken or Missing Feedback

- If the board state does not update after a guess (rows remain empty or show unexpected states like `tbd`), treat all prior guesses as having produced **no usable information**
- In this situation, continue with guesses that maximise new letter coverage using the most common English letters not yet tested, rather than guessing based on phantom constraints
- Do not guess words that reuse letters from previous guesses when the outcome of those guesses is unknown
