# Wordle Game Strategy

## Core Letter Tracking Rules

- Build a running list of confirmed-absent letters and avoid them in all future guesses, even if it means picking a less common word
- When an incorrect letter is guessed, don't use it again
- When a correct letter is guessed in the wrong place, subsequent guesses must include it in a different position — explicitly rule out all positions where it has already been tried
- When a correct letter is guessed in the right place, keep guessing words that contain that letter in that exact position

## Opening Strategy

- **Guess 1:** Use a strong opener that covers common vowels and high-frequency consonants — CRANE, STARE, SLATE, or AUDIO are good choices
- **Guess 2:** Prefer a word that avoids all absent letters while testing fresh high-frequency letters (especially untested vowels) in the remaining unknown slots — this narrows the search space quickly without wasting a guess
- After the first two guesses, minimise purely exploratory plays; shift toward candidate words that could actually be the answer

## Feedback State Interpretation

**"tbd" does NOT mean absent.** The "tbd" (to be determined) tile state is the *initial/pending* state before a guess row has been evaluated. It does not carry the same meaning as a confirmed-absent (gray) result.

- **absent / gray:** Letter is definitively not in the word — eliminate it
- **present / yellow:** Letter is in the word but wrong position — note position constraint
- **correct / green:** Letter is in the word in the correct position — lock it in
- **tbd:** Evaluation is pending or the API has not returned a result yet — treat as no information, not as absent

## Handling Broken or Frozen Board State

If the board state appears frozen (e.g., rows 2+ still show as empty after accepted plays, or all tiles remain "tbd" after multiple guesses), treat this as a **feedback blackout** rather than all-absent results:

1. **Do not assume "tbd" = absent** — this will compound errors across every subsequent guess
2. **Recognise the failure mode early** — if row 2 still shows empty after your second guess is accepted, the board rendering is broken
3. **Shift to common-word mode:** Without reliable feedback, pivot from pure letter-coverage/exploration to guessing high-frequency, plausible 5-letter answer words (LIGHT, PROXY, FOUND, etc.) — you maximise the chance of a lucky solve
4. **Do not keep repeating alphabet-coverage guesses** past guess 3 if you have received no usable feedback — the marginal value of each new letter drops sharply when you cannot act on the results

## General Guidance

- Confirm feedback is usable before acting on it — when in doubt, state the assumed interpretation explicitly in reasoning
- If you must play with zero information, prefer common everyday words over exotic letter combinations; the answer pool skews toward familiar vocabulary
- Track letters used cumulatively across all guesses to avoid accidental repeats, even under information-blackout conditions