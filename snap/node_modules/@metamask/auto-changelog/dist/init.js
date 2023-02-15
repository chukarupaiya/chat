"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyChangelog = void 0;
const changelog_1 = __importDefault(require("./changelog"));
/**
 * Creates a new empty changelog.
 *
 * @param options
 * @param options.repoUrl - The GitHub repository URL for the current project.
 * @returns The initial changelog text.
 */
function createEmptyChangelog({ repoUrl }) {
    const changelog = new changelog_1.default({ repoUrl });
    return changelog.toString();
}
exports.createEmptyChangelog = createEmptyChangelog;
//# sourceMappingURL=init.js.map