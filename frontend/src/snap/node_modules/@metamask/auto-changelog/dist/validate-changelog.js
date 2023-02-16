"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChangelog = exports.ChangelogFormattingError = exports.MissingCurrentVersionError = exports.UncategorizedChangesError = exports.UnreleasedChangesError = exports.InvalidChangelogError = void 0;
const constants_1 = require("./constants");
const parse_changelog_1 = require("./parse-changelog");
/**
 * Indicates that the changelog is invalid.
 */
class InvalidChangelogError extends Error {
}
exports.InvalidChangelogError = InvalidChangelogError;
/**
 * Indicates that unreleased changes are still present in the changelog.
 */
class UnreleasedChangesError extends InvalidChangelogError {
    constructor() {
        super('Unreleased changes present in the changelog');
    }
}
exports.UnreleasedChangesError = UnreleasedChangesError;
class UncategorizedChangesError extends InvalidChangelogError {
    constructor() {
        super('Uncategorized changes present in the changelog');
    }
}
exports.UncategorizedChangesError = UncategorizedChangesError;
/**
 * Indicates that the release header for the current version is missing.
 */
class MissingCurrentVersionError extends InvalidChangelogError {
    /**
     * @param currentVersion - The current version
     */
    constructor(currentVersion) {
        super(`Current version missing from changelog: '${currentVersion}'`);
    }
}
exports.MissingCurrentVersionError = MissingCurrentVersionError;
/**
 * Represents a formatting error in a changelog.
 */
class ChangelogFormattingError extends InvalidChangelogError {
    /**
     * @param options
     * @param options.validChangelog - The string contents of the well-formatted
     * changelog.
     * @param options.invalidChangelog - The string contents of the malformed
     * changelog.
     */
    constructor({ validChangelog, invalidChangelog, }) {
        super('Changelog is not well-formatted');
        this.data = {
            validChangelog,
            invalidChangelog,
        };
    }
}
exports.ChangelogFormattingError = ChangelogFormattingError;
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
function validateChangelog({ changelogContent, currentVersion, repoUrl, isReleaseCandidate, }) {
    var _a, _b;
    const changelog = parse_changelog_1.parseChangelog({ changelogContent, repoUrl });
    const hasUnreleasedChanges = Object.keys(changelog.getUnreleasedChanges()).length !== 0;
    const releaseChanges = currentVersion
        ? changelog.getReleaseChanges(currentVersion)
        : undefined;
    if (isReleaseCandidate) {
        if (!currentVersion) {
            throw new Error(`A version must be specified if 'isReleaseCandidate' is set.`);
        }
        else if (!changelog
            .getReleases()
            .find((release) => release.version === currentVersion)) {
            throw new MissingCurrentVersionError(currentVersion);
        }
        else if (hasUnreleasedChanges) {
            throw new UnreleasedChangesError();
        }
        else if (((_a = releaseChanges === null || releaseChanges === void 0 ? void 0 : releaseChanges[constants_1.ChangeCategory.Uncategorized]) === null || _a === void 0 ? void 0 : _a.length) &&
            ((_b = releaseChanges === null || releaseChanges === void 0 ? void 0 : releaseChanges[constants_1.ChangeCategory.Uncategorized]) === null || _b === void 0 ? void 0 : _b.length) !== 0) {
            throw new UncategorizedChangesError();
        }
    }
    const validChangelog = changelog.toString();
    if (validChangelog !== changelogContent) {
        throw new ChangelogFormattingError({
            validChangelog,
            invalidChangelog: changelogContent,
        });
    }
}
exports.validateChangelog = validateChangelog;
//# sourceMappingURL=validate-changelog.js.map