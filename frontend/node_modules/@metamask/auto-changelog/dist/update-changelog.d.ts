import { Version } from './constants';
export interface UpdateChangelogOptions {
    changelogContent: string;
    currentVersion?: Version;
    repoUrl: string;
    isReleaseCandidate: boolean;
    projectRootDirectory?: string;
}
/**
 * Update a changelog with any commits made since the last release. Commits for
 * PRs that are already included in the changelog are omitted.
 * @param options
 * @param options.changelogContent - The current changelog
 * @param options.currentVersion - The current version. Required if
 * `isReleaseCandidate` is set, but optional otherwise.
 * @param options.repoUrl - The GitHub repository URL for the current project.
 * @param options.isReleaseCandidate - Denotes whether the current project.
 * is in the midst of release preparation or not. If this is set, any new
 * changes are listed under the current release header. Otherwise, they are
 * listed under the 'Unreleased' section.
 * @param options.projectRootDirectory - The root project directory, used to
 * filter results from various git commands. This path is assumed to be either
 * absolute, or relative to the current directory. Defaults to the root of the
 * current git repository.
 * @returns The updated changelog text
 */
export declare function updateChangelog({ changelogContent, currentVersion, repoUrl, isReleaseCandidate, projectRootDirectory, }: UpdateChangelogOptions): Promise<string | undefined>;
