# Wordle Game Strategy

## Opening Guess
- Use a word that covers a broad spread of common vowels (A, E, I, O) and high-frequency consonants (R, S, T, L, N)
- CRANE is a strong opener: hits A, E, and three common consonants
- Avoid repeating letters in the opening guess — wasted coverage

## Handling "tbd" / Unresolved Feedback

Occasionally, letter tile states may remain `"tbd"` (to-be-determined) or guesses may appear not to have registered on the board display. This is a feedback rendering issue, not a game state issue — **the guess was recorded**.

**Critical rules when feedback is unresolved:**

1. **Never replay a word that has already been guessed.** Repeating a word yields zero new information and burns a guess — this is one of the worst errors possible in Wordle.
2. **Do not wait for feedback to "arrive" by making another guess.** The display lag will not resolve by re-guessing.
3. **Proceed with the pre-planned exploration sequence.** If you cannot read feedback from guess N, treat it as having produced no usable information and make the next best exploration guess from scratch — introduce the highest-value untested letters (e.g., after CRANE, play SLOTH; after SLOTH, play DUMPY).
4. **Track what has already been submitted** even if the board doesn't show it, and exclude those words from future guesses.

If multiple consecutive guesses return "tbd" with no resolution, assume the game session is broken and continue by covering maximum new letter territory each turn with a fresh word.

---

## Handling Feedback

- **Absent letter:** Never use it again in any subsequent guess
- **Correct letter, wrong position:** Include it in the next guess, but in a different position
- **Correct letter, correct position:** Keep it in that exact position in every subsequent guess

### Positional Elimination for "Present" Letters
When a letter is marked *present* across multiple guesses, each guess eliminates one more candidate position. Track all ruled-out positions; once only one position remains, that letter's location is effectively confirmed — treat it as locked when building the next guess. For example: if N is present-but-not-pos-4 after guess 1, then present-but-not-pos-3 after guess 2, and positions 1–2 are already occupied by correct letters, N **must** be at position 5. Use this inference to move into Phase 2 earlier and avoid exploratory guesses that are no longer needed.

**Positional inference is a path into Phase 2 even with zero confirmed positions.** If enough "present" letters have had enough positions ruled out, the candidate pool can shrink to just a handful of words — at that point, switch to a direct answer attempt regardless of how many positions are formally locked.

## Guess 2 Strategy — Reposition and Probe

When guess 1 yields multiple *present* letters, the second guess should do two things at once:

1. **Reposition all known-present letters** into new, untested positions — this generates maximum positional elimination data on letters you already know are in the word
2. **Introduce new high-frequency letters** to test fresh territory (T, S, L, I, O, U are good targets)

This "reposition + probe" approach is more powerful than simply testing new letters, because it narrows both *which* letters are in the word and *where* they go simultaneously.

*Example: CRANE yields R(present/not-2), N(present/not-4), E(present/not-5). TONER places R at pos-5, N at pos-3, E at pos-4 — all new positions — while also testing T and O. After just two guesses, all three letters have had two positions eliminated, dramatically shrinking the candidate pool.*

## Exploration vs. Exploitation

Use this two-phase model to decide whether to explore or go for the answer:

### Phase 1 — Constrained Exploration (when ≤ 2 positions are confirmed AND the candidate pool is still large)
When few positions are locked in and many candidates remain, do not immediately attempt a direct solution. Instead, pick a word that:
1. Satisfies all known constraints (correct-position letters stay, absent letters excluded)
2. Repositions any known-present letters to new positions (gaining positional data)
3. Simultaneously tests as many new high-frequency letters as possible

*Example: after CRANE gives `_ _ A _ E`, guessing SLATE (also `_ _ A _ E`) burns through S, L, T in one move rather than guessing blindly at a specific word.*

### Phase 2 — Direct Answer Attempt (when any of the following apply)
Switch to guessing the most likely answer directly when:
- **3 or more positions are confirmed**, or
- **The candidate pool has shrunk to a very small set** (even with zero confirmed positions — positional inference alone can achieve this), or
- **You are on guess 4 or later** — the cost of one more exploratory guess is too high

At this point exploration has diminishing returns and every remaining guess should be a real attempt.

## General Principles

- Prioritise covering the five vowels (A, E, I, O, U) across the first two or three guesses
- When the pattern is highly constrained, mentally enumerate remaining candidates before guessing and pick the most common/likely one
- Avoid guessing words that are valid only under some assumptions — if you already have enough information, commit to the answer
- Track eliminated letters carefully; reusing an absent letter is a wasted guess
- **Never repeat a word that has already been submitted** — this is always wrong regardless of board display state; a repeated guess yields zero new information
- A 3-guess solve is achievable when guess 2 aggressively repositions present letters — this collapses the candidate space faster than a pure letter-discovery approach

## Planned Exploration Sequence (fallback when feedback is unavailable)

If board feedback is completely unavailable across multiple guesses, use this pre-planned sequence to maximise letter coverage:

| Guess | Word  | Letters covered                                   |
|-------|-------|---------------------------------------------------|
| 1     | CRANE | C, R, A, N, E                                     |
| 2     | SLOTH | S, L, O, T, H                                     |
| 3     | DUMPY | D, U, M, P, Y                                     |
| 4     | FIXED | F, I, X, E, D (pivot to real attempt if any feedback exists) |

These four guesses cover 18 unique letters, leaving only J, K, Q, V, W, Z untested — the rarest letters in English. This sequence is the safest fallback when the feedback system is unreliable.
