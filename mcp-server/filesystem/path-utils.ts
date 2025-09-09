import * as path from 'path';
import * as os from 'os';

// Normalize all paths consistently
export function normalizePath(p: string): string {
  return path.normalize(p);
}

export function expandHome(filepath: string): string {
  if (filepath.startsWith('~/') || filepath === '~') {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

export function isAbsolutePath(p: string): boolean {
  return path.isAbsolute(p);
}

export function joinPaths(...paths: string[]): string {
  return path.join(...paths);
}

export function getParentDir(p: string): string {
  return path.dirname(p);
}

export function getBasename(p: string): string {
  return path.basename(p);
}

export function getExtension(p: string): string {
  return path.extname(p);
}
