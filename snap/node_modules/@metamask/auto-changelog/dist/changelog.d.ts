import { ChangeCategory, Version } from './constants';
interface ReleaseMetadata {
    /**
     * The version of the current release.
     */
    version: Version;
    /**
     * An ISO-8601 formatted date, representing the
     * release date.
     */
    date?: string;
    /**
     * The status of the release (e.g. 'WITHDRAWN', 'DEPRECATED')
     */
    status?: string;
}
interface AddReleaseOptions {
    addToStart?: boolean;
    date?: string;
    status?: string;
    version: Version;
}
interface AddChangeOptions {
    addToStart?: boolean;
    category: ChangeCategory;
    description: string;
    version?: Version;
}
/**
 * A changelog that complies with the
 * ["Keep a Changelog" v1.1.0 guidelines](https://keepachangelog.com/en/1.0.0/).
 *
 * This changelog starts out completely empty, and allows new releases and
 * changes to be added such that the changelog remains compliant at all times.
 * This can be used to help validate the contents of a changelog, normalize
 * formatting, update a changelog, or build one from scratch.
 */
export default class Changelog {
    private _releases;
    private _changes;
    private _repoUrl;
    /**
     * Construct an empty changelog
     *
     * @param options
     * @param options.repoUrl - The GitHub repository URL for the current project
     */
    constructor({ repoUrl }: {
        repoUrl: string;
    });
    /**
     * Add a release to the changelog.
     *
     * @param options
     * @param options.addToStart - Determines whether the change is added to the
     * top or bottom of the list of changes in this category. This defaults to
     * `true` because changes should be in reverse-chronological order. This
     * should be set to `false` when parsing a changelog top-to-bottom.
     * @param options.date - An ISO-8601 formatted date, representing the release
     * date.
     * @param options.status - The status of the release (e.g. 'WITHDRAWN',
     * 'DEPRECATED')
     * @param options.version - The version of the current release, which should
     * be a [SemVer](https://semver.org/spec/v2.0.0.html)-compatible version.
     */
    addRelease({ addToStart, date, status, version }: AddReleaseOptions): void;
    /**
     * Add a change to the changelog.
     *
     * @param options
     * @param options.addToStart - Determines whether the change is added to the
     * top or bottom of the list of changes in this category. This defaults to
     * `true` because changes should be in reverse-chronological order. This
     * should be set to `false` when parsing a changelog top-to-bottom.
     * @param options.category - The category of the change.
     * @param options.description - The description of the change.
     * @param options.version - The version this change was released in. If this
     * is not given, the change is assumed to be unreleased.
     */
    addChange({ addToStart, category, description, version, }: AddChangeOptions): void;
    /**
     * Migrate all unreleased changes to a release section.
     *
     * Changes are migrated in their existing categories, and placed above any
     * pre-existing changes in that category.
     *
     * @param version - The release version to migrate unreleased changes to.
     */
    migrateUnreleasedChangesToRelease(version: Version): void;
    /**
     * Gets the metadata for all releases.
     *
     * @returns The metadata for each release.
     */
    getReleases(): ReleaseMetadata[];
    /**
     * Gets the release of the given version.
     *
     * @param version - The version of the release to retrieve.
     * @returns The specified release, or undefined if no such release exists.
     */
    getRelease(version: Version): ReleaseMetadata | undefined;
    /**
     * Gets the stringified release of the given version.
     * Throws an error if no such release exists.
     *
     * @param version - The version of the release to stringify.
     * @returns The stringified release, as it appears in the changelog.
     */
    getStringifiedRelease(version: Version): string;
    /**
     * Gets the changes in the given release, organized by category.
     *
     * @param version - The version of the release being retrieved.
     * @returns The changes included in the given released.
     */
    getReleaseChanges(version: Version): Partial<Record<ChangeCategory, string[]>>;
    /**
     * Gets all changes that have not yet been released
     *
     * @returns The changes that have not yet been released.
     */
    getUnreleasedChanges(): Partial<Record<ChangeCategory, string[]>>;
    /**
     * The stringified changelog, formatted according to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
     *
     * @returns The stringified changelog.
     */
    toString(): string;
}
export {};
