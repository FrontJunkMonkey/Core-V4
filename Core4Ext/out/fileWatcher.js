"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWatcher = void 0;
const vscode = require("vscode");
class FileWatcher {
    constructor(classDetector, cssGenerator) {
        this.allClasses = new Set();
        this.classDetector = classDetector;
        this.cssGenerator = cssGenerator;
    }
    startWatching() {
        if (this.fileSystemWatcher) {
            this.fileSystemWatcher.dispose();
        }
        // Watch for changes in HTML, PHP, Vue, JSX, TSX, ASP, ASPX, and other DOM files
        this.fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.{html,php,vue,jsx,tsx,asp,aspx,cshtml,erb,jsp,haml,slim}');
        this.fileSystemWatcher.onDidChange(this.handleFileChange.bind(this));
        this.fileSystemWatcher.onDidCreate(this.handleFileChange.bind(this));
        this.fileSystemWatcher.onDidDelete(this.handleFileChange.bind(this));
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
    }
    async handleFileChange(uri) {
        // Debounce the file change to avoid excessive processing
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(async () => {
            await this.scanAllFiles();
        }, 1000); // Wait 1 second after last change
    }
    async scanAllFiles() {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return;
            }
            // Clear previous classes
            this.allClasses.clear();
            // Find all relevant files
            const files = await vscode.workspace.findFiles('**/*.{html,php,vue,jsx,tsx,asp,aspx,cshtml,erb,jsp,haml,slim}');
            // Scan each file for classes
            for (const file of files) {
                try {
                    const content = await vscode.workspace.fs.readFile(file);
                    const text = Buffer.from(content).toString('utf8');
                    const classes = this.classDetector.detectClasses(text);
                    classes.forEach(cls => this.allClasses.add(cls));
                }
                catch (error) {
                    console.error(`Error reading file ${file.fsPath}:`, error);
                }
            }
            // Generate CSS if we found any classes
            if (this.allClasses.size > 0) {
                await this.generateAndSaveCSS();
            }
            else {
                // If no classes found, delete the CSS file if it exists
                try {
                    const workspaceFolders = vscode.workspace.workspaceFolders;
                    if (!workspaceFolders)
                        return;
                    const config = vscode.workspace.getConfiguration('core4');
                    const outputPath = config.get('outputPath', './core4.css');
                    const outputUri = vscode.Uri.joinPath(workspaceFolders[0].uri, outputPath);
                    await vscode.workspace.fs.delete(outputUri);
                    console.log('No Core4 classes found, deleted CSS file');
                }
                catch (error) {
                    // File might not exist, ignore error
                }
            }
        }
        catch (error) {
            console.error('Error scanning files:', error);
        }
    }
    async generateAndSaveCSS() {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return;
            }
            // Get configuration
            const config = vscode.workspace.getConfiguration('core4');
            const minify = config.get('minify', true);
            const outputPath = config.get('outputPath', './core4.css');
            // Generate CSS from detected classes
            const css = this.cssGenerator.generateCSS(this.allClasses, minify);
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
            console.log(`Core4 CSS generated with ${this.allClasses.size} classes`);
        }
        catch (error) {
            console.error('Error generating CSS:', error);
        }
    }
}
exports.FileWatcher = FileWatcher;
//# sourceMappingURL=fileWatcher.js.map