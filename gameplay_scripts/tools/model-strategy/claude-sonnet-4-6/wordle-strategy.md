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

## Consonant Frequency Prioritisation

When choosing between candidate words for exploratory guesses (any guess where you are testing new letters rather than committing to an answer), **always prefer words that test higher-frequency consonants** in the unconstrained slots.

**Approximate consonant priority order (highest to lowest):**
> T, N, S, R, H, D, L, C, M, F, G, P, B, V, K, W, Y, J, X, Q, Z

This priority applies across **all** guesses, not just the second. A pattern like `_ _ A _ E` with many eliminations already in play still leaves high-value consonants (M, H, D, P, F, B, G) to probe — test those before resorting to W, V, K, or other rare letters.

**Example failure mode to avoid:** After CRANE + STALE eliminate {C, R, N, S, T, L}, guessing WEAVE tests only W and V — both low-frequency. A better choice like IMAGE tests I, M, G — higher frequency and more likely to yield useful hits.

## Positional Inference for Yellow Letters

When a yellow letter has been placed in several positions already (reducing it to only one or two remaining candidate slots), **use English phonotactic patterns to infer the most likely position before committing a guess.** This can narrow placement without spending an extra exploratory turn.

**Common positional tendencies to exploit:**

- **N** is far more common at the end of words (position 5) or after a vowel than at the start of a consonant cluster. If the pattern is `T_??N_` vs `TN___`, the latter is nearly impossible in English — N almost certainly belongs at position 5.
- **E** rarely starts a word; it is extremely common in positions 3–5.
- **Letters that follow T or other stop consonants at word-start** are usually vowels or liquids (L, R) — so a yellow L or R may safely be placed post-vowel rather than crammed before an opener consonant.
- **Double-letter or vowel-cluster rules**: if only one free slot makes phonetic sense, commit to it directly in the next guess rather than probing both options.

**Practical rule:** When a yellow letter has only 2 positions left and one of them creates an implausible English consonant cluster or ending, eliminate that position by reasoning and place the letter in the other slot immediately.

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
- When the pattern is tightly constrained (many green locks, few free slots), mentally enumerate candidate words and score them by the frequency of the new consonants they would test — pick the highest-scoring option
