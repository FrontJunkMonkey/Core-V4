import * as vscode from 'vscode';

export class SettingsPanel {
    public static currentPanel: SettingsPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (SettingsPanel.currentPanel) {
            SettingsPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'core4Settings',
            'Core4 Settings',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [extensionUri]
            }
        );

        SettingsPanel.currentPanel = new SettingsPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'updateSetting':
                        this._updateSetting(message.key, message.value);
                        return;
                    case 'resetToDefaults':
                        this._resetToDefaults();
                        return;
                    case 'generateCSS':
                        vscode.commands.executeCommand('core4.generateCSS');
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    private _updateSetting(key: string, value: any) {
        const config = vscode.workspace.getConfiguration('core4');
        config.update(key, value, vscode.ConfigurationTarget.Workspace);
    }

    private _resetToDefaults() {
        const config = vscode.workspace.getConfiguration('core4');
        const defaults = {
            enabled: true,
            outputPath: './styles/core4.css',
            minify: true,
            includeDefaultStyles: true,
            primaryColor: '#008001',
            secondaryColor: '#005500',
            highlightColor: '#ff6b35',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            baseFontSize: '16px',
            borderRadius: '0.35em',
            shadowColor: 'rgba(0,0,0,0.1)'
        };

        Object.keys(defaults).forEach(key => {
            config.update(key, (defaults as any)[key], vscode.ConfigurationTarget.Workspace);
        });

        this._update();
        vscode.window.showInformationMessage('Core4 settings reset to defaults');
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const config = vscode.workspace.getConfiguration('core4');
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Core4 Settings</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--vscode-widget-border);
        }
        .header h1 {
            color: var(--vscode-textLink-foreground);
            margin-bottom: 10px;
        }
        .header p {
            color: var(--vscode-descriptionForeground);
            margin: 0;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 8px;
        }
        .section h2 {
            margin-top: 0;
            color: var(--vscode-textLink-foreground);
            border-bottom: 1px solid var(--vscode-widget-border);
            padding-bottom: 10px;
        }
        .setting-group {
            margin-bottom: 20px;
        }
        .setting-group:last-child {
            margin-bottom: 0;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: var(--vscode-input-foreground);
        }
        input, select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-family: inherit;
            box-sizing: border-box;
        }
        input[type="color"] {
            width: 60px;
            height: 40px;
            padding: 2px;
            cursor: pointer;
        }
        input[type="checkbox"] {
            width: auto;
            margin-right: 8px;
        }
        .color-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .color-group input[type="color"] {
            flex-shrink: 0;
        }
        .color-group input[type="text"] {
            flex: 1;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
        }
        .buttons {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--vscode-widget-border);
        }
        button {
            padding: 10px 20px;
            margin: 0 5px;
            border: 1px solid var(--vscode-button-border);
            border-radius: 4px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            cursor: pointer;
            font-family: inherit;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        button.primary {
            background-color: var(--vscode-textLink-foreground);
            color: var(--vscode-textLink-activeForeground);
        }
        .description {
            font-size: 0.9em;
            color: var(--vscode-descriptionForeground);
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚙️ Core4 Settings</h1>
            <p>Configure your Core4 CSS framework generation</p>
        </div>

        <div class="section">
            <h2>🎨 Colors</h2>
            <div class="setting-group">
                <label for="primaryColor">Primary Color</label>
                <div class="color-group">
                    <input type="color" id="primaryColor" value="${config.get('primaryColor', '#008001')}" onchange="updateSetting('primaryColor', this.value)">
                    <input type="text" value="${config.get('primaryColor', '#008001')}" onchange="updateColorFromText('primaryColor', this)">
                </div>
                <div class="description">Main brand color used for buttons, links, and accents</div>
            </div>
            <div class="setting-group">
                <label for="secondaryColor">Secondary Color</label>
                <div class="color-group">
                    <input type="color" id="secondaryColor" value="${config.get('secondaryColor', '#005500')}" onchange="updateSetting('secondaryColor', this.value)">
                    <input type="text" value="${config.get('secondaryColor', '#005500')}" onchange="updateColorFromText('secondaryColor', this)">
                </div>
                <div class="description">Secondary brand color for subtle elements</div>
            </div>
            <div class="setting-group">
                <label for="highlightColor">Highlight Color</label>
                <div class="color-group">
                    <input type="color" id="highlightColor" value="${config.get('highlightColor', '#ff6b35')}" onchange="updateSetting('highlightColor', this.value)">
                    <input type="text" value="${config.get('highlightColor', '#ff6b35')}" onchange="updateColorFromText('highlightColor', this)">
                </div>
                <div class="description">Accent color for highlights and call-to-action elements</div>
            </div>
            <div class="setting-group">
                <label for="shadowColor">Shadow Color</label>
                <div class="color-group">
                    <input type="text" id="shadowColor" value="${config.get('shadowColor', 'rgba(0,0,0,0.1)')}" onchange="updateSetting('shadowColor', this.value)">
                </div>
                <div class="description">Color for box shadows and depth effects</div>
            </div>
        </div>

        <div class="section">
            <h2>📝 Typography</h2>
            <div class="setting-group">
                <label for="fontFamily">Font Family</label>
                <select id="fontFamily" onchange="updateSetting('fontFamily', this.value)">
                    <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" ${config.get('fontFamily') === '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' ? 'selected' : ''}>System Default</option>
                    <option value="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" ${config.get('fontFamily') === "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" ? 'selected' : ''}>Inter</option>
                    <option value="'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" ${config.get('fontFamily') === "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" ? 'selected' : ''}>Poppins</option>
                    <option value="'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" ${config.get('fontFamily') === "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" ? 'selected' : ''}>Source Sans Pro</option>
                    <option value="Georgia, 'Times New Roman', Times, serif" ${config.get('fontFamily') === "Georgia, 'Times New Roman', Times, serif" ? 'selected' : ''}>Georgia (Serif)</option>
                </select>
                <div class="description">Font family for all text elements</div>
            </div>
            <div class="setting-group">
                <label for="baseFontSize">Base Font Size</label>
                <input type="text" id="baseFontSize" value="${config.get('baseFontSize', '16px')}" onchange="updateSetting('baseFontSize', this.value)">
                <div class="description">Base font size (e.g., 16px, 1em, 1rem)</div>
            </div>
        </div>

        <div class="section">
            <h2>🎯 Layout & Effects</h2>
            <div class="setting-group">
                <label for="borderRadius">Border Radius</label>
                <input type="text" id="borderRadius" value="${config.get('borderRadius', '0.35em')}" onchange="updateSetting('borderRadius', this.value)">
                <div class="description">Default border radius for rounded elements</div>
            </div>
        </div>

        <div class="section">
            <h2>⚙️ Generation Options</h2>
            <div class="setting-group">
                <label for="outputPath">Output Path</label>
                <input type="text" id="outputPath" value="${config.get('outputPath', './styles/core4.css')}" onchange="updateSetting('outputPath', this.value)">
                <div class="description">Where to save the generated CSS file</div>
            </div>
            <div class="setting-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="minify" ${config.get('minify', true) ? 'checked' : ''} onchange="updateSetting('minify', this.checked)">
                    <label for="minify">Minify CSS output</label>
                </div>
                <div class="description">Remove whitespace and comments for smaller file size</div>
            </div>
            <div class="setting-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="includeDefaultStyles" ${config.get('includeDefaultStyles', true) ? 'checked' : ''} onchange="updateSetting('includeDefaultStyles', this.checked)">
                    <label for="includeDefaultStyles">Include default styles</label>
                </div>
                <div class="description">Include Core4's base styles and resets</div>
            </div>
        </div>

        <div class="buttons">
            <button onclick="generateCSS()" class="primary">🔄 Generate CSS Now</button>
            <button onclick="resetToDefaults()">↩️ Reset to Defaults</button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function updateSetting(key, value) {
            vscode.postMessage({
                command: 'updateSetting',
                key: key,
                value: value
            });
        }

        function updateColorFromText(colorId, textInput) {
            const colorInput = document.getElementById(colorId);
            if (textInput.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                colorInput.value = textInput.value;
                updateSetting(colorId, textInput.value);
            }
        }

        function resetToDefaults() {
            vscode.postMessage({
                command: 'resetToDefaults'
            });
        }

        function generateCSS() {
            vscode.postMessage({
                command: 'generateCSS'
            });
        }

        // Sync color inputs
        document.querySelectorAll('input[type="color"]').forEach(colorInput => {
            colorInput.addEventListener('change', function() {
                const textInput = this.parentElement.querySelector('input[type="text"]');
                if (textInput) {
                    textInput.value = this.value;
                }
            });
        });
    </script>
</body>
</html>`;
    }

    public dispose() {
        SettingsPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}