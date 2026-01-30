import { DiffPart } from "../types";

/**
 * A basic word-level diffing implementation using LCS (Longest Common Subsequence).
 * Since we are doing a "Mood Rewrite", words mostly stay in similar positions.
 */
export function diffWords(oldStr: string, newStr: string): DiffPart[] {
  const oldWords = oldStr.split(/\s+/);
  const newWords = newStr.split(/\s+/);
  
  const n = oldWords.length;
  const m = newWords.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (oldWords[i - 1].toLowerCase() === newWords[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffPart[] = [];
  let i = n, j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1].toLowerCase() === newWords[j - 1].toLowerCase()) {
      // Prioritize the word from the NEW version for casing/exact matches if they differ only by case
      result.unshift({ value: newWords[j - 1] + ' ' });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ value: newWords[j - 1] + ' ', added: true });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({ value: oldWords[i - 1] + ' ', removed: true });
      i--;
    }
  }

  return result;
}
