import * as path from 'path';
import * as os from 'os';
// Normalize all paths consistently
export function normalizePath(p) {
    return path.normalize(p);
}
export function expandHome(filepath) {
    if (filepath.startsWith('~/') || filepath === '~') {
        return path.join(os.homedir(), filepath.slice(1));
    }
    return filepath;
}
export function isAbsolutePath(p) {
    return path.isAbsolute(p);
}
export function joinPaths(...paths) {
    return path.join(...paths);
}
export function getParentDir(p) {
    return path.dirname(p);
}
export function getBasename(p) {
    return path.basename(p);
}
export function getExtension(p) {
    return path.extname(p);
}
//# sourceMappingURL=path-utils.js.map