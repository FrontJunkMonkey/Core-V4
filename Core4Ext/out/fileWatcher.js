"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWatcher = void 0;
const vscode = require("vscode");
class FileWatcher {
    constructor(classDetector, cssGenerator) {
        this.fileClassMap = new Map();
        // Extended file types including .NET Blazor and other popular frameworks
        this.watchPattern = '**/*.{html,htm,php,vue,jsx,tsx,asp,aspx,cshtml,razor,erb,jsp,haml,slim,svelte,astro,liquid,twig,blade.php,mustache,hbs}';
        this.classDetector = classDetector;
        this.cssGenerator = cssGenerator;
    }
    startWatching() {
        if (this.fileSystemWatcher) {
            this.fileSystemWatcher.dispose();
        }
        this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher(this.watchPattern);
        this.fileSystemWatcher.onDidChange(this.handleFileChange.bind(this));
        this.fileSystemWatcher.onDidCreate(this.handleFileChange.bind(this));
        this.fileSystemWatcher.onDidDelete(this.handleFileDelete.bind(this));
        // Initial scan
        this.scanAllFiles();
    }
    stopWatching() {
        if (this.fileSystemWatcher) {
            this.fileSystemWatcher.dispose();
            this.fileSystemWatcher = undefined;
        }
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.fileClassMap.clear();
    }
    async handleFileChange(uri) {
        // Shorter debounce for single file changes - faster response
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(async () => {
            await this.updateSingleFile(uri);
        }, 300); // Faster response for single file changes
    }
    async handleFileDelete(uri) {
        // Remove classes from deleted file
        this.fileClassMap.delete(uri.fsPath);
        await this.regenerateCSS();
    }
    async updateSingleFile(uri) {
        try {
            const content = await vscode.workspace.fs.readFile(uri);
            const text = Buffer.from(content).toString('utf8');
            const newClasses = this.classDetector.detectClasses(text);
            // Update only this file's classes
            this.fileClassMap.set(uri.fsPath, newClasses);
            // Regenerate CSS with all classes
            await this.regenerateCSS();
        }
        catch (error) {
            console.error(`Error updating file ${uri.fsPath}:`, error);
        }
    }
    async scanAllFiles() {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders)
                return;
            // Clear previous classes
            this.fileClassMap.clear();
            // Find all relevant files
            const files = await vscode.workspace.findFiles(this.watchPattern);
            // Parallel file processing for better performance
            await Promise.all(files.map(async (file) => {
                try {
                    const content = await vscode.workspace.fs.readFile(file);
                    const text = Buffer.from(content).toString('utf8');
                    const classes = this.classDetector.detectClasses(text);
                    this.fileClassMap.set(file.fsPath, classes);
                }
                catch (error) {
                    console.error(`Error reading file ${file.fsPath}:`, error);
                }
            }));
            await this.regenerateCSS();
        }
        catch (error) {
            console.error('Error scanning files:', error);
        }
    }
    async regenerateCSS() {
        // Combine all classes from all files
        const allClasses = new Set();
        this.fileClassMap.forEach(fileClasses => {
            fileClasses.forEach(cls => allClasses.add(cls));
        });
        if (allClasses.size > 0) {
            await this.generateAndSaveCSS(allClasses);
        }
        else {
            // If no classes found, delete the CSS file if it exists
            await this.deleteCSSFile();
        }
    }
    async generateAndSaveCSS(allClasses) {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders)
                return;
            // Get configuration
            const config = vscode.workspace.getConfiguration('core4');
            const minify = config.get('minify', true);
            const outputPath = config.get('outputPath', './styles/core4.css');
            // Generate CSS from detected classes
            const css = this.cssGenerator.generateCSS(allClasses, minify);
            // Create output URI
            const outputUri = vscode.Uri.joinPath(workspaceFolders[0].uri, outputPath);
            // Ensure directory exists
            const outputDir = vscode.Uri.joinPath(outputUri, '..');
            try {
                await vscode.workspace.fs.createDirectory(outputDir);
            }
            catch (error) {
                // Directory might already exist
            }
            // Write CSS file
            await vscode.workspace.fs.writeFile(outputUri, Buffer.from(css));
            console.log(`Core4 CSS generated with ${allClasses.size} classes`);
        }
        catch (error) {
            console.error('Error generating CSS:', error);
        }
    }
    async deleteCSSFile() {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders)
                return;
            const config = vscode.workspace.getConfiguration('core4');
            const outputPath = config.get('outputPath', './styles/core4.css');
            const outputUri = vscode.Uri.joinPath(workspaceFolders[0].uri, outputPath);
            await vscode.workspace.fs.delete(outputUri);
            console.log('No Core4 classes found, deleted CSS file');
        }
        catch (error) {
            // File might not exist, ignore error
        }
    }
}
exports.FileWatcher = FileWatcher;
//# sourceMappingURL=fileWatcher.js.map