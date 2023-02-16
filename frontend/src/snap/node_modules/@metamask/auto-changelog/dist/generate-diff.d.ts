/**
 * Generates a diff between two multi-line string files. The resulting diff
 * shows any changes using '-' and '+' to indicate the "old" and "new" version
 * respectively, and includes 2 lines of unchanged content around each changed
 * section where possible.
 * @param before - The string representing the base for the comparison.
 * @param after - The string representing the changes being compared.
 * @returns The genereated text diff
 */
export declare function generateDiff(before: string, after: string): string;
