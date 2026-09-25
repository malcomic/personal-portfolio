export function longestWordLength(text: string) {
  return Math.max(...text.split(" ").map((word) => word.length));
}
