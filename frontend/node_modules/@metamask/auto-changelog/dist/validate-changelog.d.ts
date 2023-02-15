import { Version } from './constants';
/**
 * Indicates that the changelog is invalid.
 */
export declare class InvalidChangelogError extends Error {
}
/**
 * Indicates that unreleased changes are still present in the changelog.
 */
export declare class UnreleasedChangesError extends InvalidChangelogError {
    constructor();
}
export declare class UncategorizedChangesError extends InvalidChangelogError {
    constructor();
}
/**
 * Indicates that the release header for the current version is missing.
 */
export declare class MissingCurrentVersionError extends InvalidChangelogError {
    /**
     * @param currentVersion - The current version
     */
    constructor(currentVersion: Version);
}
/**
 * Represents a formatting error in a changelog.
 */
export declare class ChangelogFormattingError extends InvalidChangelogError {
    data: Record<string, string>;
    /**
     * @param options
     * @param options.validChangelog - The string contents of the well-formatted
     * changelog.
     * @param options.invalidChangelog - The string contents of the malformed
     * changelog.
     */
    constructor({ validChangelog, invalidChangelog, }: {
        validChangelog: string;
        invalidChangelog: string;
    });
}
interface ValidateChangelogOptions {
    changelogContent: string;
    currentVersion?: Version;
    repoUrl: string;
    isReleaseCandidate: boolean;
}
/**
 * Validates that a changelog is well-formatted.
 *
 * @param options
 * @param options.changelogContent - The current changelog
 * @param options.currentVersion - The current version. Required if
 * `isReleaseCandidate` is set, but optional otherwise.
 * @param options.repoUrl - The GitHub repository URL for the current
 * project.
 * @param options.isReleaseCandidate - Denotes whether the current project is in
 * the midst of release preparation or not. If this is set, this command will
 * also ensure the current version is represented in the changelog with a
 * header, and that there are no unreleased changes present.
 * @throws `InvalidChangelogError` - Will throw if the changelog is invalid
 * @throws `MissingCurrentVersionError` - Will throw if `isReleaseCandidate` is
 * `true` and the changelog is missing the release header for the current
 * version.
 * @throws `UnreleasedChangesError` - Will throw if `isReleaseCandidate` is
 * `true` and the changelog contains unreleased changes.
 * @throws `UnreleasedChangesError` - Will throw if `isReleaseCandidate` is
 * `true` and the changelog contains uncategorized changes.
 * @throws `ChangelogFormattingError` - Will throw if there is a formatting error.
 */
export declare function validateChangelog({ changelogContent, currentVersion, repoUrl, isReleaseCandidate, }: ValidateChangelogOptions): void;
export {};
