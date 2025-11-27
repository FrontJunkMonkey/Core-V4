# Changelog

All notable changes to the Core4 VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-11-27

### Added
- 🎯 **New Display Utilities**: Added support for new d- prefix display classes
  - `d-off` - display: none
  - `d-block` - display: block  
  - `d-inline` - display: inline
  - `d-inline-block` - display: inline-block
  - `d-flex` - display: flex
  - `d-grid` - display: grid
- 📱 **Responsive Display Utilities**: Full responsive variants for all display utilities
  - Examples: `d-sm-off`, `d-md-block`, `d-lg-flex`, etc.
- 🎨 **Layout Pattern Support**: Added support for the new `layout-12-33` grid pattern
  - Creates a 3-element grid with specific grid areas
- 🔍 **Enhanced Class Detection**: Updated regex patterns to detect all new display and layout classes
- ⚡ **Updated Framework Sync**: Extension now matches the latest Core4 framework (Nov 27, 2025)

### Updated
- Updated CSS generator to handle new display utility patterns
- Improved class detection for better coverage
- Enhanced responsive breakpoint handling

## [0.2.0] - 2024-11-13

### Added
- 🎨 **Visual Settings Panel**: Beautiful webview-based settings with color pickers and font selectors
- 📊 **Statistics Dashboard**: View project statistics including class counts and file sizes
- 🎯 **Command Palette Integration**: Full VS Code command support for all features
- 📱 **Enhanced Command Set**: 
  - `Core4: Open Settings` - Visual settings panel
  - `Core4: Open CSS Output File` - Direct access to generated CSS
  - `Core4: Show Statistics` - Project metrics and insights
- 🏷️ **Marketplace Readiness**: Added proper metadata, categories, keywords, and gallery banner
- 📝 **Enhanced Documentation**: Comprehensive README with examples and usage guides
- ⚙️ **Improved Configuration**: Better descriptions, validation patterns, and enum options

### Enhanced
- 🎨 **Color System**: Visual color pickers with hex input validation
- 📝 **Font Selection**: Dropdown selector with popular font stack options
- 🔧 **Better UX**: Auto-sync between color picker and text inputs
- 📦 **Package Metadata**: Added repository links, keywords, and proper categorization
- 🎯 **Command Organization**: Grouped commands under "Core4" category with icons

### Fixed
- ✅ **Class Detection**: Verified 100% coverage of all Core4 framework classes
- 🔧 **Settings Sync**: Proper workspace-level configuration management
- 📁 **Path Handling**: Better file path validation and error handling

## [0.1.0] - 2024-11-01

### Added
- 🚀 **Initial Release**: Core CSS generation functionality
- 👁️ **File Watching**: Real-time monitoring of HTML/template files
- 🎯 **Class Detection**: Automatic detection of Core4 classes in files
- ⚡ **CSS Generation**: On-demand and automatic CSS file generation
- 📊 **Status Bar Integration**: Simple toggle button for enable/disable
- ⚙️ **Basic Configuration**: Workspace-level settings for colors, fonts, and paths
- 🔧 **Command Support**: Basic commands for CSS generation and toggle watching

### Supported File Types
- HTML (`.html`, `.htm`)
- PHP (`.php`)
- Vue (`.vue`)
- React (`.jsx`, `.tsx`)
- ASP.NET (`.asp`, `.aspx`, `.cshtml`, `.razor`)
- Ruby (`.erb`)
- Java (`.jsp`)
- Haml (`.haml`)
- Slim (`.slim`)
- Svelte (`.svelte`)
- Astro (`.astro`)
- Template engines (`.liquid`, `.twig`, `.blade.php`, `.mustache`, `.hbs`)

### Core4 Framework Support
- ✅ Layout system with explicit child-to-row mapping
- ✅ 9 responsive breakpoints (sm through ld)
- ✅ Complete utility class system (spacing, typography, colors)
- ✅ Alignment classes (9-point grid system)
- ✅ Gap utilities with responsive variants
- ✅ Max-lines truncation classes
- ✅ Container variations
- ✅ All responsive class variants

---

## Upcoming Features

### [0.3.0] - Planned
- 🎬 **Animated Previews**: GIFs showing extension in action
- 🎨 **Theme Integration**: Support for VS Code theme colors
- 📈 **Usage Analytics**: Optional telemetry for improvement insights
- 🔔 **Update Notifications**: In-editor update prompts and changelogs
- 🎯 **Quick Actions**: Toolbar buttons for common actions

### [0.4.0] - Future
- 🧪 **Live Preview**: Real-time CSS preview in webview
- 📱 **Mobile Simulator**: Preview responsive breakpoints
- 🎨 **Color Palette Management**: Save and share color schemes
- 📊 **Advanced Analytics**: Detailed usage reports and optimization suggestions
- 🔧 **Custom Class Detection**: User-defined class patterns

---

## Migration Guide

### From 0.1.x to 0.2.x
- **Settings Panel**: Use `Core4: Open Settings` for visual configuration
- **New Commands**: Access enhanced features via Command Palette
- **Configuration**: Existing settings are preserved and enhanced
- **No Breaking Changes**: All existing functionality continues to work

---

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/FrontJunkMonkey/Core-V4/issues)
- 📖 **Documentation**: [README](README.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/FrontJunkMonkey/Core-V4/discussions)