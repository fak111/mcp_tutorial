// Common filesystem operations utilities
import * as fs from 'fs/promises';
import * as path from 'path';
import { diffLines } from 'diff';
import { minimatch } from 'minimatch';
import { normalizePath, expandHome } from './path-utils.js';
export function formatSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0)
        return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
export function formatFileSize(bytes) {
    return formatSize(bytes);
}
export function sanitizePath(path) {
    return path.replace(/[<>:"|?*]/g, '_');
}
export function validatePath(filePath, allowedDirectories) {
    const normalizedPath = normalizePath(expandHome(filePath));
    const resolvedPath = path.resolve(normalizedPath);
    const isValid = allowedDirectories.some(allowedDir => {
        const normalizedAllowed = normalizePath(expandHome(allowedDir));
        const resolvedAllowed = path.resolve(normalizedAllowed);
        return resolvedPath.startsWith(resolvedAllowed);
    });
    if (!isValid) {
        throw new Error(`Access denied: ${filePath} is outside allowed directories`);
    }
    return resolvedPath;
}
export async function getFileStats(filePath) {
    const stats = await fs.stat(filePath);
    return {
        size: stats.size,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        mtime: stats.mtime,
        atime: stats.atime,
        ctime: stats.ctime,
    };
}
export async function readFileContent(filePath, encoding = 'utf8') {
    return await fs.readFile(filePath, encoding);
}
export async function writeFileContent(filePath, content, encoding = 'utf8') {
    await fs.writeFile(filePath, content, encoding);
}
export async function searchFilesWithValidation(pattern, allowedDirectories, maxResults = 100) {
    const results = [];
    for (const allowedDir of allowedDirectories) {
        try {
            const files = await fs.readdir(allowedDir, { withFileTypes: true, recursive: true });
            for (const file of files) {
                if (results.length >= maxResults)
                    break;
                const fullPath = path.join(allowedDir, file.name);
                if (minimatch(fullPath, pattern) && validatePath(fullPath, allowedDirectories)) {
                    results.push(fullPath);
                }
            }
        }
        catch (error) {
            console.warn(`Error searching in directory ${allowedDir}:`, error);
        }
        if (results.length >= maxResults)
            break;
    }
    return results;
}
export async function applyFileEdits(filePath, edits, allowedDirectories) {
    if (!validatePath(filePath, allowedDirectories)) {
        return { success: false, error: 'Path not allowed' };
    }
    try {
        const originalContent = await readFileContent(filePath);
        let modifiedContent = originalContent;
        for (const edit of edits) {
            if (edit.options?.partialMatch) {
                modifiedContent = modifiedContent.replace(edit.oldText, edit.newText);
            }
            else {
                if (modifiedContent.includes(edit.oldText)) {
                    modifiedContent = modifiedContent.replace(edit.oldText, edit.newText);
                }
                else {
                    return { success: false, error: `Text not found: ${edit.oldText}` };
                }
            }
        }
        await writeFileContent(filePath, modifiedContent);
        const diff = diffLines(originalContent, modifiedContent);
        const diffString = diff.map(part => part.added ? `+${part.value}` :
            part.removed ? `-${part.value}` :
                part.value).join('');
        return { success: true, diff: diffString };
    }
    catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function tailFile(filePath, lines = 10) {
    const content = await readFileContent(filePath);
    const allLines = content.split('\n');
    return allLines.slice(-lines);
}
export async function headFile(filePath, lines = 10) {
    const content = await readFileContent(filePath);
    const allLines = content.split('\n');
    return allLines.slice(0, lines);
}
let allowedDirectories = [];
export function setAllowedDirectories(directories) {
    allowedDirectories = directories;
}
export function getAllowedDirectories() {
    return allowedDirectories;
}
//# sourceMappingURL=lib.js.map