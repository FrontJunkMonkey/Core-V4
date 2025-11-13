import * as vscode from 'vscode';
import { ClassDetector } from './classDetector';
import { CSSGenerator } from './cssGenerator';
import { FileWatcher } from './fileWatcher';
import { SettingsPanel } from './settingsPanel';

export function activate(context: vscode.ExtensionContext) {
    console.log('Core4 Extension is now active!');

    const classDetector = new ClassDetector();
    const cssGenerator = new CSSGenerator();
    const fileWatcher = new FileWatcher(classDetector, cssGenerator);

    // Create status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(eye) Core4';
    statusBarItem.tooltip = 'Click to toggle Core4 CSS generation';
    statusBarItem.command = 'core4.toggleWatching';
    statusBarItem.show();

    // Track watching state
    let isWatching = false;

    // Load saved state from workspace settings
    async function loadProjectState(): Promise<boolean> {
        try {
            const config = vscode.workspace.getConfiguration('core4');
            return config.get<boolean>('enabled', false);
        } catch (error) {
            return false; // Default to disabled
        }
    }

    // Save project state to workspace settings
    async function saveProjectState(enabled: boolean): Promise<void> {
        try {
            const config = vscode.workspace.getConfiguration('core4');
            await config.update('enabled', enabled, vscode.ConfigurationTarget.Workspace);
        } catch (error) {
            console.error('Error saving Core4 state:', error);
        }
    }

    // Initialize state
    async function initializeState() {
        const savedState = await loadProjectState();
        if (savedState) {
            fileWatcher.startWatching();
            isWatching = true;
            statusBarItem.text = '$(eye-closed) Core4';
            statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
        }
    }

    // Register commands
    let generateCommand = vscode.commands.registerCommand('core4.generateCSS', () => {
        generateCSS();
    });

    let openSettingsCommand = vscode.commands.registerCommand('core4.openSettings', () => {
        SettingsPanel.createOrShow(context.extensionUri);
    });

    let openOutputCommand = vscode.commands.registerCommand('core4.openOutput', async () => {
        const config = vscode.workspace.getConfiguration('core4');
        const outputPath = config.get('outputPath', './styles/core4.css');
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            const outputUri = vscode.Uri.joinPath(workspaceFolders[0].uri, outputPath);
            try {
                await vscode.window.showTextDocument(outputUri);
            } catch (error) {
                vscode.window.showWarningMessage(`Output file not found: ${outputPath}. Generate CSS first.`);
            }
        }
    });

    let showStatsCommand = vscode.commands.registerCommand('core4.showStats', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const detector = new ClassDetector();
        const files = await vscode.workspace.findFiles('**/*.{html,htm,php,vue,jsx,tsx,asp,aspx,cshtml,razor,erb,jsp,haml,slim,svelte,astro,liquid,twig,blade.php,mustache,hbs}');
        
        let totalClasses = new Set<string>();
        let fileCount = 0;
        
        for (const file of files) {
            try {
                const content = await vscode.workspace.fs.readFile(file);
                const text = Buffer.from(content).toString('utf8');
                const classes = detector.detectClasses(text);
                if (classes.size > 0) {
                    fileCount++;
                    classes.forEach(cls => totalClasses.add(cls));
                }
            } catch (error) {
                // Skip files that can't be read
            }
        }

        const config = vscode.workspace.getConfiguration('core4');
        const outputPath = config.get('outputPath', './styles/core4.css');
        let fileSize = 'Not generated';
        
        try {
            const outputUri = vscode.Uri.joinPath(workspaceFolders[0].uri, outputPath);
            const stat = await vscode.workspace.fs.stat(outputUri);
            fileSize = `${(stat.size / 1024).toFixed(1)} KB`;
        } catch (error) {
            // File doesn't exist
        }

        const message = `📊 Core4 Statistics\n\n` +
            `🎯 Classes Found: ${totalClasses.size}\n` +
            `📁 Files Scanned: ${files.length}\n` +
            `✅ Files with Core4: ${fileCount}\n` +
            `📄 CSS File Size: ${fileSize}\n` +
            `📍 Output Path: ${outputPath}`;

        vscode.window.showInformationMessage(message, { modal: true });
    });

    let toggleCommand = vscode.commands.registerCommand('core4.toggleWatching', async () => {
        if (isWatching) {
            fileWatcher.stopWatching();
            isWatching = false;
            statusBarItem.text = '$(eye) Core4';
            statusBarItem.backgroundColor = undefined;
            await saveProjectState(false);
            vscode.window.showInformationMessage('Core4: Watching stopped');
        } else {
            // Check if this is the first time enabling Core4 for this project
            const config = vscode.workspace.getConfiguration('core4');
            const isFirstTime = !config.has('enabled');

            if (isFirstTime) {
                // Create workspace settings for this project
                await config.update('enabled', true, vscode.ConfigurationTarget.Workspace);
                await config.update('outputPath', './styles/core4.css', vscode.ConfigurationTarget.Workspace);
                await config.update('minify', true, vscode.ConfigurationTarget.Workspace);
                await config.update('includeDefaultStyles', true, vscode.ConfigurationTarget.Workspace);
                await config.update('primaryColor', '#008001', vscode.ConfigurationTarget.Workspace);
                await config.update('secondaryColor', '#005500', vscode.ConfigurationTarget.Workspace);
                await config.update('highlightColor', '#ff6b35', vscode.ConfigurationTarget.Workspace);
                await config.update('fontFamily', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', vscode.ConfigurationTarget.Workspace);
                await config.update('baseFontSize', '16px', vscode.ConfigurationTarget.Workspace);
                await config.update('borderRadius', '0.35em', vscode.ConfigurationTarget.Workspace);
                await config.update('shadowColor', 'rgba(0,0,0,0.1)', vscode.ConfigurationTarget.Workspace);

                vscode.window.showInformationMessage('Core4 project settings created! You can customize them in the settings.');
            }

            fileWatcher.startWatching();
            isWatching = true;
            statusBarItem.text = '$(eye-closed) Core4';
            statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
            await saveProjectState(true);
            vscode.window.showInformationMessage('Core4: Watching started');
        }
    });

    // Listen for configuration changes to clear caches
    const configChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('core4')) {
            cssGenerator.clearCaches();
            console.log('Core4: Configuration changed, cleared caches');
        }
    });

    context.subscriptions.push(
        generateCommand, 
        toggleCommand, 
        openSettingsCommand,
        openOutputCommand,
        showStatsCommand,
        statusBarItem, 
        configChangeListener
    );

    // Initialize state
    initializeState();
}

async function generateCSS() {
    try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }

        const detector = new ClassDetector();
        const generator = new CSSGenerator();

        // Scan all supported files in workspace
        const files = await vscode.workspace.findFiles('**/*.{html,htm,php,vue,jsx,tsx,asp,aspx,cshtml,razor,erb,jsp,haml,slim,svelte,astro,liquid,twig,blade.php,mustache,hbs}');

        let allClasses = new Set<string>();

        for (const file of files) {
            const content = await vscode.workspace.fs.readFile(file);
            const text = Buffer.from(content).toString('utf8');
            const classes = detector.detectClasses(text);
            classes.forEach(cls => allClasses.add(cls));
        }

        // Get configuration
        const config = vscode.workspace.getConfiguration('core4');
        const minify = config.get<boolean>('minify', true);
        const outputPath = config.get('outputPath', './styles/core4.css');

        if (allClasses.size === 0) {
            // Delete CSS file if no classes found
            try {
                const outputUri = vscode.Uri.joinPath(workspaceFolders[0].uri, outputPath);
                await vscode.workspace.fs.delete(outputUri);
                vscode.window.showInformationMessage('No Core4 classes found, deleted CSS file.');
            } catch (error) {
                vscode.window.showInformationMessage('No Core4 classes found in your files.');
            }
            return;
        }

        // Generate CSS
        const css = generator.generateCSS(allClasses, minify);

        const outputUri = vscode.Uri.joinPath(workspaceFolders[0].uri, outputPath);

        // Ensure directory exists
        const outputDir = vscode.Uri.joinPath(outputUri, '..');
        try {
            await vscode.workspace.fs.createDirectory(outputDir);
        } catch (error) {
            // Directory might already exist
        }

        await vscode.workspace.fs.writeFile(outputUri, Buffer.from(css));

        vscode.window.showInformationMessage(`Core4 CSS generated with ${allClasses.size} classes!`);

    } catch (error) {
        vscode.window.showErrorMessage(`Error generating CSS: ${error}`);
    }
}

export function deactivate() {
    console.log('Core4 Extension deactivated');
}