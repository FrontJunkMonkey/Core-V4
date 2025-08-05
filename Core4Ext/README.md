# Core4 Extension

A Cursor/VSCode extension that automatically generates optimized CSS for the Core4 framework based on classes used in your HTML files.

## Features

- **Automatic CSS Generation**: Watches your HTML files and generates only the CSS you actually use
- **System Fonts**: Uses modern system fonts for a professional look out of the box
- **Layout-First Design**: Focuses on your unique layout system with explicit child-to-row mapping
- **Complete System**: Includes spacing, typography, colors, and essential styling
- **Tiny CSS Files**: Only generates CSS for classes you actually use
- **Status Bar Control**: Simple button to enable/disable watching per project

## Installation

### For Testing (Local Installation)

1. **Download the VSIX file**: The extension is packaged as `core4-extension-0.1.0.vsix`

2. **Install in Cursor/VSCode**:
   - Open Cursor/VSCode
   - Go to Extensions (Ctrl+Shift+X)
   - Click the "..." menu in the Extensions panel
   - Select "Install from VSIX..."
   - Choose the `core4-extension-0.1.0.vsix` file

3. **Activate the Extension**:
   - Open a project folder in Cursor/VSCode
   - Look for the "Core4" button in the status bar (bottom-right)
   - Click it to enable CSS generation for your project

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

## Output

The extension generates a `core4.css` file in your `styles/` folder containing:

1. **Base styles** (always included)
2. **Element styles** (always included)
3. **Class styles** (only for classes you actually use)

## Example Output

```css
/* Core4 Base Styles */
* {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  box-sizing: border-box;
}

/* Form elements and buttons */
input, select, textarea {
  padding: 0.6em 1.2em;
  border: 1px solid #ddd;
  border-radius: 0.35em;
  font-size: inherit;
  font-family: inherit;
}

button, .button {
  padding: 0.6em 1.2em;
  border: none;
  border-radius: 0.35em;
  background: #008001;
  color: white;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

/* Your used classes */
.layout-123-456 {
  display: grid;
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