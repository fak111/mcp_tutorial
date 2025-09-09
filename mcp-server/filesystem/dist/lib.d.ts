export interface FileEditOptions {
    preserveIndentation?: boolean;
    normalizeWhitespace?: boolean;
    partialMatch?: boolean;
}
export interface EditResult {
    success: boolean;
    diff?: string;
    error?: string;
}
export declare function formatSize(bytes: number): string;
export declare function formatFileSize(bytes: number): string;
export declare function sanitizePath(path: string): string;
export declare function validatePath(filePath: string, allowedDirectories: string[]): string;
export declare function getFileStats(filePath: string): Promise<{
    size: number;
    isDirectory: boolean;
    isFile: boolean;
    mtime: Date;
    atime: Date;
    ctime: Date;
}>;
export declare function readFileContent(filePath: string, encoding?: BufferEncoding): Promise<string>;
export declare function writeFileContent(filePath: string, content: string, encoding?: BufferEncoding): Promise<void>;
export declare function searchFilesWithValidation(pattern: string, allowedDirectories: string[], maxResults?: number): Promise<string[]>;
export declare function applyFileEdits(filePath: string, edits: Array<{
    oldText: string;
    newText: string;
    options?: FileEditOptions;
}>, allowedDirectories: string[]): Promise<EditResult>;
export declare function tailFile(filePath: string, lines?: number): Promise<string[]>;
export declare function headFile(filePath: string, lines?: number): Promise<string[]>;
export declare function setAllowedDirectories(directories: string[]): void;
export declare function getAllowedDirectories(): string[];
//# sourceMappingURL=lib.d.ts.map