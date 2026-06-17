# Wordle Game Strategy

## Opening Guess
- Use a word that covers a broad spread of common vowels (A, E, I, O) and high-frequency consonants (R, S, T, L, N)
- CRANE is a strong opener: hits A, E, and three common consonants
- Avoid repeating letters in the opening guess — wasted coverage

## Handling Feedback

- **Absent letter:** Never use it again in any subsequent guess
- **Correct letter, wrong position:** Include it in the next guess, but in a different position
- **Correct letter, correct position:** Keep it in that exact position in every subsequent guess

### Positional Elimination for "Present" Letters
When a letter is marked *present* across multiple guesses, each guess eliminates one more candidate position. Track all ruled-out positions; once only one position remains, that letter's location is effectively confirmed — treat it as locked when building the next guess. For example: if N is present-but-not-pos-4 after guess 1, then present-but-not-pos-3 after guess 2, and positions 1–2 are already occupied by correct letters, N **must** be at position 5. Use this inference to move into Phase 2 earlier and avoid exploratory guesses that are no longer needed.

## Exploration vs. Exploitation

Use this two-phase model to decide whether to explore or go for the answer:

### Phase 1 — Constrained Exploration (when ≤ 2 positions are confirmed)
When few positions are locked in, do not immediately attempt a direct solution. Instead, pick a word that:
1. Satisfies all known constraints (correct-position letters stay, absent letters excluded)
2. Simultaneously tests as many new high-frequency letters as possible

This "constrained exploration" approach is more efficient than a pure answer attempt when there are still many unknowns — it rules out multiple letters at once while still honouring confirmed positions.

*Example: after CRANE gives `_ _ A _ E`, guessing SLATE (also `_ _ A _ E`) burns through S, L, T in one move rather than guessing blindly at a specific word.*

### Phase 2 — Direct Answer Attempt (when ≥ 3 positions are confirmed, or the candidate pool is very small)
Once 3 or more positions are locked or only a handful of valid words remain, switch to guessing the most likely answer directly. At this point exploration has diminishing returns and every remaining guess should be a real attempt.

## General Principles

- Prioritise covering the five vowels (A, E, I, O, U) across the first two or three guesses
- When the pattern is highly constrained (e.g. `_ M A _ E`), mentally enumerate remaining candidates before guessing and pick the most common/likely one
- Avoid guessing words that are valid only under some assumptions — if you already have enough information, commit to the answer
- Track eliminated letters carefully; reusing an absent letter is a wasted guess
