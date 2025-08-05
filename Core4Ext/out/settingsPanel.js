"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsPanel = void 0;
const vscode = require("vscode");
class SettingsPanel {
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (SettingsPanel.currentPanel) {
            SettingsPanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel('core4Settings', 'Core4 Settings', column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, 'media'),
                vscode.Uri.joinPath(extensionUri, 'out/compiled')
            ]
        });
        SettingsPanel.currentPanel = new SettingsPanel(panel, extensionUri);
    }
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'updateSetting':
                    this._updateSetting(message.key, message.value);
                    return;
                case 'getSettings':
                    this._sendSettings();
                    return;
            }
        }, null, this._disposables);
    }
    async _updateSetting(key, value) {
        try {
            const config = vscode.workspace.getConfiguration('core4');
            await config.update(key, value, vscode.ConfigurationTarget.Workspace);
            vscode.window.showInformationMessage(`Core4 setting '${key}' updated!`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error updating setting: ${error}`);
        }
    }
    async _sendSettings() {
        const config = vscode.workspace.getConfiguration('core4');
        const settings = {
            outputPath: config.get('outputPath', './styles/core4.css'),
            minify: config.get('minify', true),
            includeDefaultStyles: config.get('includeDefaultStyles', true),
            primaryColor: config.get('primaryColor', '#008001'),
            secondaryColor: config.get('secondaryColor', '#005500'),
            highlightColor: config.get('highlightColor', '#ff6b35'),
            fontFamily: config.get('fontFamily', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'),
            baseFontSize: config.get('baseFontSize', '16px'),
            borderRadius: config.get('borderRadius', '0.35em'),
            shadowColor: config.get('shadowColor', 'rgba(0,0,0,0.1)')
        };
        this._panel.webview.postMessage({ command: 'settings', data: settings });
    }
    dispose() {
        SettingsPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        const webview = this._panel.webview;
        this._panel.title = "Core4 Settings";
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }
    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Core4 Settings</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 8px;
        }
        .section h2 {
            margin-top: 0;
            color: var(--vscode-editor-foreground);
            border-bottom: 2px solid var(--vscode-focusBorder);
            padding-bottom: 10px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: var(--vscode-editor-foreground);
        }
        input[type="text"], input[type="color"], select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-size: 14px;
        }
        input[type="checkbox"] {
            margin-right: 8px;
        }
        .color-preview {
            width: 30px;
            height: 30px;
            border-radius: 4px;
            border: 2px solid var(--vscode-input-border);
            display: inline-block;
            margin-left: 10px;
            vertical-align: middle;
        }
        .description {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-top: 5px;
        }
        .button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        }
        .button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .button.secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .button.secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }

    </style>
</head>
<body>
    <div class="container">
        <h1>Core4 Settings</h1>
        
        <div class="section">
            <h2>General Settings</h2>
            
            <div class="form-group">
                <div class="description">💡 Use the Core4 button in the status bar to enable/disable CSS generation</div>
            </div>

            <div class="form-group">
                <label for="outputPath">Output Path</label>
                <input type="text" id="outputPath" placeholder="./styles/core4.css">
                <div class="description">Where the generated CSS file will be saved</div>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" id="minify">
                    Minify CSS output
                </label>
                <div class="description">Compress the generated CSS file</div>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" id="includeDefaultStyles">
                    Include default element styles
                </label>
                <div class="description">Include default styling for buttons, inputs, etc. (disable for existing websites)</div>
            </div>
        </div>

        <div class="section">
            <h2>Brand Colors</h2>
            
            <div class="form-group">
                <label for="primaryColor">Primary Color</label>
                <input type="color" id="primaryColor">
                <div class="color-preview" id="primaryPreview"></div>
                <div class="description">Main brand color for buttons, links, etc.</div>
            </div>

            <div class="form-group">
                <label for="secondaryColor">Secondary Color</label>
                <input type="color" id="secondaryColor">
                <div class="color-preview" id="secondaryPreview"></div>
                <div class="description">Secondary color for hover states, etc.</div>
            </div>

            <div class="form-group">
                <label for="highlightColor">Highlight Color</label>
                <input type="color" id="highlightColor">
                <div class="color-preview" id="highlightPreview"></div>
                <div class="description">Accent color for highlights and special elements</div>
            </div>
        </div>

        <div class="section">
            <h2>Typography</h2>
            
            <div class="form-group">
                <label for="fontFamily">Font Family</label>
                <input type="text" id="fontFamily" placeholder="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
                <div class="description">Default font family for the project</div>
            </div>

            <div class="form-group">
                <label for="baseFontSize">Base Font Size</label>
                <input type="text" id="baseFontSize" placeholder="16px">
                <div class="description">Base font size for the project</div>
            </div>
        </div>

        <div class="section">
            <h2>Visual Effects</h2>
            
            <div class="form-group">
                <label for="borderRadius">Border Radius</label>
                <input type="text" id="borderRadius" placeholder="0.35em">
                <div class="description">Default border radius for elements</div>
            </div>

            <div class="form-group">
                <label for="shadowColor">Shadow Color</label>
                <input type="text" id="shadowColor" placeholder="rgba(0,0,0,0.1)">
                <div class="description">Default shadow color for elements</div>
            </div>
        </div>

        <div style="margin-top: 30px;">
            <button class="button" onclick="saveSettings()">Save Settings</button>
            <button class="button secondary" onclick="resetToDefaults()">Reset to Defaults</button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let currentSettings = {};

        // Load settings when page loads
        vscode.postMessage({ command: 'getSettings' });

        // Listen for settings from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'settings':
                    currentSettings = message.data;
                    updateForm();
                    break;
            }
        });

        function updateForm() {
            document.getElementById('outputPath').value = currentSettings.outputPath || './styles/core4.css';
            document.getElementById('minify').checked = currentSettings.minify !== false;
            document.getElementById('includeDefaultStyles').checked = currentSettings.includeDefaultStyles !== false;
            document.getElementById('primaryColor').value = currentSettings.primaryColor || '#008001';
            document.getElementById('secondaryColor').value = currentSettings.secondaryColor || '#005500';
            document.getElementById('highlightColor').value = currentSettings.highlightColor || '#ff6b35';
            document.getElementById('fontFamily').value = currentSettings.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            document.getElementById('baseFontSize').value = currentSettings.baseFontSize || '16px';
            document.getElementById('borderRadius').value = currentSettings.borderRadius || '0.35em';
            document.getElementById('shadowColor').value = currentSettings.shadowColor || 'rgba(0,0,0,0.1)';
            
            updateColorPreviews();
        }

        function updateColorPreviews() {
            document.getElementById('primaryPreview').style.backgroundColor = document.getElementById('primaryColor').value;
            document.getElementById('secondaryPreview').style.backgroundColor = document.getElementById('secondaryColor').value;
            document.getElementById('highlightPreview').style.backgroundColor = document.getElementById('highlightColor').value;
        }



        function saveSettings() {
            const settings = {
                outputPath: document.getElementById('outputPath').value,
                minify: document.getElementById('minify').checked,
                includeDefaultStyles: document.getElementById('includeDefaultStyles').checked,
                primaryColor: document.getElementById('primaryColor').value,
                secondaryColor: document.getElementById('secondaryColor').value,
                highlightColor: document.getElementById('highlightColor').value,
                fontFamily: document.getElementById('fontFamily').value,
                baseFontSize: document.getElementById('baseFontSize').value,
                borderRadius: document.getElementById('borderRadius').value,
                shadowColor: document.getElementById('shadowColor').value
            };

            // Send each setting to the extension
            Object.keys(settings).forEach(key => {
                vscode.postMessage({
                    command: 'updateSetting',
                    key: key,
                    value: settings[key]
                });
            });

            currentSettings = settings;
        }

        function resetToDefaults() {
            if (confirm('Are you sure you want to reset all settings to defaults?')) {
                document.getElementById('outputPath').value = './styles/core4.css';
                document.getElementById('minify').checked = true;
                document.getElementById('includeDefaultStyles').checked = true;
                document.getElementById('primaryColor').value = '#008001';
                document.getElementById('secondaryColor').value = '#005500';
                document.getElementById('highlightColor').value = '#ff6b35';
                document.getElementById('fontFamily').value = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                document.getElementById('baseFontSize').value = '16px';
                document.getElementById('borderRadius').value = '0.35em';
                document.getElementById('shadowColor').value = 'rgba(0,0,0,0.1)';
                
                updateColorPreviews();
                saveSettings();
            }
        }

        // Update color previews when colors change
        document.getElementById('primaryColor').addEventListener('change', updateColorPreviews);
        document.getElementById('secondaryColor').addEventListener('change', updateColorPreviews);
        document.getElementById('highlightColor').addEventListener('change', updateColorPreviews);
    </script>
</body>
</html>`;
    }
}
exports.SettingsPanel = SettingsPanel;
//# sourceMappingURL=settingsPanel.js.map