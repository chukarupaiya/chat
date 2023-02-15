"use strict";
/* eslint-disable node/no-process-env, node/no-sync */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepositoryUrl = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getRepositoryUrl() {
    var _a;
    // Set automatically by NPM or Yarn 1.x
    const npmPackageRepositoryUrl = process.env.npm_package_repository_url;
    if (npmPackageRepositoryUrl) {
        return npmPackageRepositoryUrl.replace(/\.git$/u, '');
    }
    // Set automatically by Yarn 3.x
    const projectCwd = process.env.PROJECT_CWD;
    if (projectCwd) {
        const packageJson = path_1.default.resolve(projectCwd, 'package.json');
        const packageJsonContent = JSON.parse(fs_1.default.readFileSync(packageJson, 'utf8'));
        if (typeof packageJsonContent.repository === 'string') {
            return packageJsonContent.repository.replace(/\.git$/u, '');
        }
        if (typeof ((_a = packageJsonContent.repository) === null || _a === void 0 ? void 0 : _a.url) === 'string') {
            return packageJsonContent.repository.url.replace(/\.git$/u, '');
        }
    }
    return null;
}
exports.getRepositoryUrl = getRepositoryUrl;
//# sourceMappingURL=repo.js.map