"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unreleased = exports.orderedChangeCategories = exports.ChangeCategory = void 0;
/**
 * Change categories.
 *
 * Most of these categories are from [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
 * The "Uncategorized" category was added because we have many changes from
 * older releases that would be difficult to categorize.
 */
var ChangeCategory;
(function (ChangeCategory) {
    /**
     * For new features.
     */
    ChangeCategory["Added"] = "Added";
    /**
     * For changes in existing functionality.
     */
    ChangeCategory["Changed"] = "Changed";
    /**
     * For soon-to-be-removed features.
     */
    ChangeCategory["Deprecated"] = "Deprecated";
    /**
     * For bug fixes.
     */
    ChangeCategory["Fixed"] = "Fixed";
    /**
     * For now removed features.
     */
    ChangeCategory["Removed"] = "Removed";
    /**
     * In case of vulnerabilities.
     */
    ChangeCategory["Security"] = "Security";
    /**
     * For any changes that have yet to be categorized.
     */
    ChangeCategory["Uncategorized"] = "Uncategorized";
})(ChangeCategory = exports.ChangeCategory || (exports.ChangeCategory = {}));
/**
 * Change categories in the order in which they should be listed in the
 * changelog.
 */
exports.orderedChangeCategories = [
    ChangeCategory.Uncategorized,
    ChangeCategory.Added,
    ChangeCategory.Changed,
    ChangeCategory.Deprecated,
    ChangeCategory.Removed,
    ChangeCategory.Fixed,
    ChangeCategory.Security,
];
/**
 * The header for the section of the changelog listing unreleased changes.
 */
exports.unreleased = 'Unreleased';
//# sourceMappingURL=constants.js.map