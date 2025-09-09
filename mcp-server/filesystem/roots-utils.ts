import * as path from 'path';
import * as fs from 'fs/promises';
import { normalizePath, expandHome } from './path-utils.js';

export async function getValidRootDirectories(directories: string[]): Promise<string[]> {
  const validDirs: string[] = [];
  
  for (const dir of directories) {
    try {
      const expandedPath = expandHome(dir);
      const resolvedPath = path.resolve(expandedPath);
      const normalizedPath = normalizePath(resolvedPath);
      
      // Check if directory exists and is accessible
      const stats = await fs.stat(normalizedPath);
      if (stats.isDirectory()) {
        validDirs.push(normalizedPath);
      }
    } catch (error) {
      console.warn(`Warning: Directory ${dir} is not accessible:`, error);
    }
  }
  
  return validDirs;
}

export function isPathUnderRoot(targetPath: string, rootPaths: string[]): boolean {
  const normalizedTarget = normalizePath(path.resolve(targetPath));
  
  return rootPaths.some(rootPath => {
    const normalizedRoot = normalizePath(rootPath);
    return normalizedTarget.startsWith(normalizedRoot + path.sep) || 
           normalizedTarget === normalizedRoot;
  });
}

export function validatePathAgainstRoots(targetPath: string, rootPaths: string[]): string {
  if (!isPathUnderRoot(targetPath, rootPaths)) {
    throw new Error(`Access denied: ${targetPath} is outside allowed directories`);
  }
  return normalizePath(path.resolve(targetPath));
}
