# Core4 Extension

🚀 A powerful VS Code extension that automatically generates optimized CSS for the Core4 framework based on classes used in your HTML files.

## ✨ Features

- **🔄 Automatic CSS Generation**: Real-time watching and generation of only the CSS you actually use
- **⚙️ Visual Settings Panel**: Beautiful UI for configuring colors, fonts, and options with live previews
- **🎨 Color Customization**: Built-in color pickers for primary, secondary, and highlight colors
- **📱 Responsive Layout System**: Core4's unique explicit child-to-row mapping with 9 breakpoints
- **📊 Statistics Dashboard**: Track classes found, file sizes, and generation metrics
- **⚡ Tiny CSS Files**: Only generates CSS for detected classes - no bloat
- **🎯 Command Palette Integration**: Full VS Code command support for all features
- **📝 Modern Typography**: System font stacks with customizable options

## 🚀 Quick Start

### Installation

1. **From VS Code Marketplace** (Coming Soon):
   - Search "Core4 CSS Framework" in Extensions
   - Click Install

2. **From VSIX** (Current):
   - Download the latest `.vsix` file
   - Open VS Code → Extensions → "..." → "Install from VSIX..."
   - Select the downloaded file

### First Steps

1. **Open a project** in VS Code with HTML/template files
2. **Click the "Core4" button** in the status bar (bottom-right)
3. **Start using Core4 classes** in your HTML:
   ```html
   <div class="layout-12-34 gap align-mc">
     <div>Item 1</div>
     <div>Item 2</div>
     <div>Item 3</div>
     <div>Item 4</div>
   </div>
   ```
4. **CSS is generated automatically** at `./styles/core4.css`

## 🎛️ Commands

Access via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---------|-------------|
| `Core4: Open Settings` | Visual settings panel with color pickers and font selection |
| `Core4: Generate CSS` | Manually trigger CSS generation |
| `Core4: Toggle File Watching` | Start/stop automatic file watching |
| `Core4: Open CSS Output File` | Open the generated CSS file |
| `Core4: Show Statistics` | View project statistics and metrics |

## How It Works

### The Core4 Philosophy

Core4 follows one principle: **"Use the most natural, universal term that a developer would actually type."**

- **Abbreviate when unambiguous**: `m-` (margin), `p-` (padding), `fs-` (font-size)
- **Use full words when ambiguous**: `radius`, `shadow`, `relative`, `absolute`
- **Layout-first design**: Your unique explicit child-to-row mapping system

### Layout System

Core4's layout system is **NOT a traditional grid**. It's **explicit child-to-row mapping**:

```html
<!-- layout-123-456 means: -->
<!-- Children 1, 2, 3 go in the first row -->
<!-- Children 4, 5, 6 go in the second row -->
<div class="layout-123-456">
  <div>One</div>   <!-- Row 1 -->
  <div>Two</div>   <!-- Row 1 -->
  <div>Three</div> <!-- Row 1 -->
  <div>Four</div>  <!-- Row 2 -->
  <div>Five</div>  <!-- Row 2 -->
  <div>Six</div>   <!-- Row 2 -->
</div>
```

### Key Classes

#### Layout
- `layout-123-456` - Explicit child-to-row mapping

#### Spacing
- `m-1`, `p-2` - Margin and padding
- `mx-1`, `my-2` - Directional spacing

#### Typography
- `fs-2xl` - Font size
- `fw-bold` - Font weight
- `left`, `center`, `right` - Text alignment

#### Display
- `show`, `hide` - Display control
- `show-sm`, `hide-md` - Responsive display

#### Visual Effects
- `radius` - Border radius
- `shadow` - Box shadow

#### Colors
- `primary`, `secondary`, `black`, `white` - Color classes
- `bg-primary`, `bg-secondary` - Background colors

## Usage

1. **Enable the Extension**: Click the "Core4" button in the status bar
2. **Configure Settings** (Optional): Use "Core4: Open Settings" command to customize colors, fonts, etc.
3. **Write HTML**: Use Core4 classes in your HTML files
4. **Automatic Generation**: The extension generates `core4.css` in your project root
5. **Include the CSS**: Link the generated CSS in your HTML

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="core4.css">
</head>
<body>
    <div class="container">
        <h1 class="fs-3xl center">Hello Core4</h1>
        <div class="layout-12-34 m-2">
            <p class="fs-md">This looks great out of the box!</p>
        </div>
    </div>
</body>
</html>
```

## Project Settings

The extension creates a `.c4` file in your project root to remember your watching preferences. This file is hidden and contains:

```
enabled=true
```

## Configuration

**Settings are per-project** - changes only affect the current workspace, not all your projects.

You can customize the generated CSS by modifying the extension settings:

### Brand Colors
- `core4.primaryColor` - Primary brand color (buttons, links)
- `core4.secondaryColor` - Secondary brand color (hover states)
- `core4.highlightColor` - Highlight/accent color

### Typography
- `core4.fontFamily` - Default font family
- `core4.baseFontSize` - Base font size

### Visual Effects
- `core4.borderRadius` - Default border radius
- `core4.shadowColor` - Default shadow color

### Output Settings
- `core4.outputPath` - Where to save the CSS file
- `core4.minify` - Whether to minify the CSS
- `core4.includeDefaultStyles` - Include default element styles (disable for existing websites)

To open settings: Use the "Core4: Open Settings" command or go to Settings > Extensions > Core4 Extension.

## What's Included

### Always Generated (Base Styles)
- System fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...`)
- Basic container classes
- Essential positioning and display classes
- Color system

### Conditionally Generated (Element Styles)
- Form element styling (inputs, buttons, textareas) - *Only if `includeDefaultStyles` is enabled*

### Generated Based on Usage
- Layout classes (your unique system)
- Spacing classes (margin/padding)
- Typography classes
- Visual effects
- Responsive variants

## File Types Watched

- HTML files (`.html`)
- PHP files (`.php`)
- Vue files (`.vue`)
- JSX files (`.jsx`)
- TSX files (`.tsx`)
- ASP files (`.asp`)
- ASPX files (`.aspx`)
- Razor files (`.cshtml`)
- ERB files (`.erb`)
- JSP files (`.jsp`)
- Haml files (`.haml`)
- Slim files (`.slim`)

## 🎨 Settings Panel

Access the visual settings panel via `Core4: Open Settings`:

- **🎨 Color Pickers**: Visual color selection for primary, secondary, and highlight colors
- **📝 Font Selector**: Choose from popular font stacks with previews
- **⚙️ Generation Options**: Configure output path, minification, and default styles
- **🔄 One-Click Actions**: Generate CSS and reset to defaults
- **💾 Auto-Save**: Settings are saved automatically to workspace

## 📊 What Gets Generated

The extension scans your files and generates a `core4.css` file containing:

1. **📦 Base Styles**: Core4's foundational CSS (when enabled)
2. **🎯 Used Classes Only**: Only CSS for classes actually found in your files
3. **📱 Responsive Variants**: Breakpoint-specific classes you're using
4. **🎨 Custom Colors**: Your configured color scheme applied

## 🏗️ Core4 Framework Overview

### Layout System
- **Explicit Child-to-Row Mapping**: `layout-123-456` means children 1,2,3 in row 1, children 4,5,6 in row 2
- **9 Responsive Breakpoints**: `sm` (320px) through `ld` (1500px)
- **Alignment Classes**: 9-point grid system (`align-tl`, `align-mc`, `align-br`, etc.)

### Utility Classes
- **Spacing**: `m-*`, `p-*`, `mx-*`, `my-*` with responsive variants
- **Typography**: `fs-*` (font-size), `fw-*` (font-weight), alignment classes
- **Colors**: Semantic colors (`primary`, `secondary`, `highlight`) + utility colors
- **Layout Utilities**: `gap-*`, `max-lines-*`, `container-*`, display controls

### JavaScript Components
- **Text Truncation**: `readMore` functionality with "show more/less"
- **Image Galleries**: `zoomee` with lightbox and zoom capabilities  
- **Auto Sliders**: Rotating carousels with dots and progress bars

## 🚀 Performance Benefits

- **🏃‍♂️ Tiny CSS Files**: Only generates CSS for classes you actually use
- **⚡ Fast Loading**: No unused CSS means faster page loads
- **📊 Size Tracking**: Built-in statistics show file sizes and class counts
- **🔄 Real-time Updates**: CSS regenerates automatically when you add/remove classes

## ⚙️ Configuration

All settings are configurable via the Settings Panel or VS Code settings:

```json
{
  "core4.enabled": true,
  "core4.outputPath": "./styles/core4.css",
  "core4.minify": true,
  "core4.primaryColor": "#008001",
  "core4.secondaryColor": "#005500",
  "core4.highlightColor": "#ff6b35"
}
```

## 🛠️ Development

Want to contribute or modify the extension?

```bash
# Clone the repository
git clone https://github.com/FrontJunkMonkey/Core-V4.git
cd Core-V4/Core4Ext

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests to the [Core-V4 repository](https://github.com/FrontJunkMonkey/Core-V4).

## 📞 Support

- 🐛 [Report Issues](https://github.com/FrontJunkMonkey/Core-V4/issues)
- 📖 [Documentation](https://github.com/FrontJunkMonkey/Core-V4#readme)
- 💬 [Discussions](https://github.com/FrontJunkMonkey/Core-V4/discussions)
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas:
    "child-1 child-2 child-3"
    "child-4 child-5 child-6";
}

.layout-123-456 > *:nth-child(1) {
  grid-area: child-1;
}

/* ... more generated CSS ... */
```

## Why Core4?

- **No Bootstrap bloat**: Only the CSS you actually use
- **Professional defaults**: Looks great out of the box
- **Unique layout system**: Explicit child-to-row mapping
- **Natural naming**: Intuitive class names
- **5-minute learning curve**: Easy to understand and use

## Support

This extension is designed to work with the Core4 framework. For more information about Core4, see the main project documentation. 