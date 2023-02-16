import Changelog from './changelog';
/**
 * Constructs a Changelog instance that represents the given changelog, which
 * is parsed for release and change information.
 * @param options
 * @param options.changelogContent - The changelog to parse
 * @param options.repoUrl - The GitHub repository URL for the current project.
 * @returns A changelog instance that reflects the changelog text provided.
 */
export declare function parseChangelog({ changelogContent, repoUrl, }: {
    changelogContent: string;
    repoUrl: string;
}): Changelog;
