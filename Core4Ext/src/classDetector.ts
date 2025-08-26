import * as vscode from 'vscode';

export class CSSGenerator {
  private cssCache = new Map<string, string>();
  private configCache: vscode.WorkspaceConfiguration | null = null;
  private configCacheTime = 0;

  // Cache configuration for 5 seconds to avoid repeated calls
  private getConfig(): vscode.WorkspaceConfiguration {
    const now = Date.now();
    if (!this.configCache || (now - this.configCacheTime) > 5000) {
      this.configCache = vscode.workspace.getConfiguration('core4');
      this.configCacheTime = now;
    }
    return this.configCache;
  }

  // Clear caches when configuration changes
  clearCaches(): void {
    this.cssCache.clear();
    this.configCache = null;
  }

  private spacingValues: Record<string, string> = {
    '0': '0',
    'half': '0.3em',
    '1': '0.6em',
    '2': '1.2em',
    '3': '1.8em',
    '4': '2.4em',
    '5': '3em',
    '6': '4.5em',
    '7': '6em',
    '8': '7.5em'
  };

  private fontSizeValues: Record<string, string> = {
    '10xl': '105px',
    '9xl': '90px',
    '8xl': '77px',
    '7xl': '66px',
    '6xl': '56px',
    '5xl': '48px',
    '4xl': '41px',
    '3xl': '35px',
    '2xl': '26px',
    'xl': '22px',
    'lg': '18px',
    'md': '16px',
    'sm': '14px',
    'xs': '12px',
    '2xs': '11px',
    '3xs': '10px'
  };

  private colorValues: Record<string, string> = {
    'primary': '#008001',
    'secondary': '#005500',
    'highlight': '#FFB613',
    'danger': '#B71234',
    'black': '#0e0e0e',
    'white': '#fff',
    'grey-lightest': '#f4f3f3',
    'grey-darkest': '#333',
    'trans-grey': 'rgba(85, 85, 85, 0.82)',
    'trans-black': 'rgba(0, 0, 0, 0.7)',
    'dark-violet': '#663399',
    'light-violet': '#F1EEF4'
  };

  private breakpoints: Record<string, string> = {
    'sm': '320px',
    'mm': '386px',
    'lm': '466px',
    'st': '562px',
    'mt': '678px',
    'lt': '818px',
    'sd': '987px',
    'md': '1191px',
    'ld': '1500px'
  };

  generateCSS(classes: Set<string>, minify: boolean = true): string {
    let css = '';

    // Get configuration - use workspace settings for per-project configuration
    const config = this.getConfig();
    const includeDefaultStyles = config.get<boolean>('includeDefaultStyles', true);

    // Debug: Log the setting value
    console.log('Core4: includeDefaultStyles setting =', includeDefaultStyles);
    console.log('Core4: Classes found =', Array.from(classes));

    // If no classes found, return empty CSS
    if (classes.size === 0) {
      console.log('Core4: No classes found, returning empty CSS');
      return '';
    }

    // Only include base styles if includeDefaultStyles is true
    if (includeDefaultStyles) {
      css += this.generateBaseStyles();
      css += this.generateElementStyles();
      console.log('Core4: Including base and element styles');
    } else {
      console.log('Core4: Skipping base and element styles - only generating used classes');
    }

    // Generate classes based on what's used (with caching)
    classes.forEach(className => {
      css += this.getCachedClassCSS(className);
    });

    // Minify if requested
    if (minify) {
      return this.minifyCSS(css);
    }

    return css;
  }

  private getCachedClassCSS(className: string): string {
    if (this.cssCache.has(className)) {
      return this.cssCache.get(className)!;
    }

    const css = this.generateClassCSS(className);
    this.cssCache.set(className, css);
    return css;
  }

  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*{\s*/g, '{') // Remove spaces around braces
      .replace(/\s*}\s*/g, '}') // Remove spaces around braces
      .replace(/\s*:\s*/g, ':') // Remove spaces around colons
      .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
      .replace(/\s*,\s*/g, ',') // Remove spaces around commas
      .trim(); // Remove leading/trailing whitespace
  }

  private generateBaseStyles(): string {
    const config = this.getConfig();
    const fontFamily = config.get<string>('fontFamily', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif');

    return `
/* Core4 Base Styles */
* {
  font-family: ${fontFamily};
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
`;
  }

  private generateElementStyles(): string {
    const config = this.getConfig();
    const primaryColor = config.get<string>('primaryColor', '#008001');
    const secondaryColor = config.get<string>('secondaryColor', '#005500');
    const borderRadius = config.get<string>('borderRadius', '0.35em');

    return `
/* Form elements and buttons */
input, select, textarea {
  padding: 0.6em 1.2em;
  border: 1px solid #ddd;
  border-radius: ${borderRadius};
  font-size: inherit;
  font-family: inherit;
}

button, .button {
  padding: 0.6em 1.2em;
  border: none;
  border-radius: ${borderRadius};
  background: ${primaryColor};
  color: white;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

button:hover, .button:hover {
  background: ${secondaryColor};
}

/* Links */
a {
  text-decoration: none;
  color: #0e0e0e;
}
`;
  }

  private generateClassCSS(className: string): string {
    // Layout classes
    if (className.startsWith('layout-')) {
      return this.generateLayoutCSS(className);
    }

    // Spacing classes (margin/padding)
    if (className.startsWith('m-') || className.startsWith('p-')) {
      return this.generateSpacingCSS(className);
    }

    // Font size classes
    if (className.startsWith('fs-')) {
      return this.generateFontSizeCSS(className);
    }

    // Font weight classes
    if (className.startsWith('fw-')) {
      return this.generateFontWeightCSS(className);
    }

    // Color classes
    const config = this.getConfig();
    const primaryColor = config.get<string>('primaryColor', '#008001');
    const secondaryColor = config.get<string>('secondaryColor', '#005500');
    const highlightColor = config.get<string>('highlightColor', '#ff6b35');

    // Use config values for brand colors, fallback to predefined for semantic colors
    const colorMap: Record<string, string> = {
      primary: primaryColor,
      secondary: secondaryColor,
      highlight: highlightColor,
      danger: '#dc3545',
      success: '#28a745',
      warning: '#ffc107',
      info: '#17a2b8',
      black: '#000000',
      white: '#ffffff',
      'grey-lightest': '#f8f9fa',
      'grey-darkest': '#343a40',
      'trans-grey': 'rgba(0,0,0,0.1)',
      'trans-black': 'rgba(0,0,0,0.8)',
      'dark-violet': '#4a148c',
      'light-violet': '#e1bee7'
    };

    if (className in colorMap) {
      return `.${className} { color: ${colorMap[className]}; }\n`;
    }

    // Background color classes
    if (className.startsWith('bg-')) {
      const colorName = className.substring(3);
      if (colorName in colorMap) {
        return `.${className} { background-color: ${colorMap[colorName]}; }\n`;
      }
    }

    // Responsive display classes
    if (className.startsWith('show-') || className.startsWith('hide-')) {
      return this.generateResponsiveDisplayCSS(className);
    }

    // Max lines classes
    if (className.startsWith('max-lines-')) {
      return this.generateMaxLinesCSS(className);
    }

    // Gap classes
    if (className === 'gap') {
      return this.generateDefaultGapCSS();
    }
    if (className.startsWith('gap-')) {
      return this.generateGapCSS(className);
    }

    // Alignment classes
    if (className.startsWith('align-')) {
      return this.generateAlignmentCSS(className);
    }

    // Utility classes
    const borderRadius = config.get<string>('borderRadius', '0.35em');
    const shadowColor = config.get<string>('shadowColor', 'rgba(0,0,0,0.1)');

    switch (className) {
      case 'container':
        return `.${className} { width: 100%; max-width: 1550px; margin: 0 auto; }\n`;
      case 'relative':
        return `.${className} { position: relative; }\n`;
      case 'absolute':
        return `.${className} { position: absolute; }\n`;
      case 'fixed':
        return `.${className} { position: fixed; }\n`;
      case 'left':
        return `.${className} { text-align: left !important; }\n`;
      case 'center':
        return `.${className} { text-align: center !important; }\n`;
      case 'right':
        return `.${className} { text-align: right !important; }\n`;
      case 'show':
        return `.${className} { display: block !important; }\n`;
      case 'hide':
        return `.${className} { display: none !important; }\n`;
      case 'radius':
        return `.${className} { border-radius: ${borderRadius}; }\n`;
      case 'shadow':
        return `.${className} { box-shadow: 0 4px 6px ${shadowColor}; }\n`;
    }

    return '';
  }

  private generateLayoutCSS(className: string): string {
    // Extract the layout pattern (e.g., "123-456" from "layout-123-456")
    const pattern = className.replace('layout-', '');
    const rows = pattern.split('-');

    if (rows.length === 0) return '';

    const numCols = rows[0].length;
    const numRows = rows.length;

    // Helper function to get character value (0-9 = 0-9, a-z = 10-35)
    const getCharValue = (char: string): number => {
      if (char >= '0' && char <= '9') return parseInt(char);
      if (char >= 'a' && char <= 'z') return 10 + (char.charCodeAt(0) - 'a'.charCodeAt(0));
      return -1; // Invalid character
    };

    // Parse the grid to find element positions and spans
    const elementPositions = new Map<number, {
      minRow: number;
      maxRow: number;
      minCol: number;
      maxCol: number;
      firstAppearance: { row: number; col: number };
    }>();

    rows.forEach((row, rowIndex) => {
      [...row].forEach((char, colIndex) => {
        const value = getCharValue(char);
        if (value === -1) return; // Skip invalid characters

        if (!elementPositions.has(value)) {
          elementPositions.set(value, {
            minRow: rowIndex + 1,
            maxRow: rowIndex + 1,
            minCol: colIndex + 1,
            maxCol: colIndex + 1,
            firstAppearance: { row: rowIndex, col: colIndex }
          });
        } else {
          const pos = elementPositions.get(value)!;
          pos.minRow = Math.min(pos.minRow, rowIndex + 1);
          pos.maxRow = Math.max(pos.maxRow, rowIndex + 1);
          pos.minCol = Math.min(pos.minCol, colIndex + 1);
          pos.maxCol = Math.max(pos.maxCol, colIndex + 1);
        }
      });
    });

    // Sort elements by order of first appearance to assign nth-child indices
    const sortedElements = Array.from(elementPositions.entries())
      .sort(([a, posA], [b, posB]) => {
        const rowDiff = posA.firstAppearance.row - posB.firstAppearance.row;
        if (rowDiff !== 0) return rowDiff;
        return posA.firstAppearance.col - posB.firstAppearance.col;
      });

    // Generate compact CSS
    let css = `.${className} {\n`;
    css += `  display: grid;\n`;
    css += `  grid: repeat(${numRows}, 1fr) / repeat(${numCols}, 1fr);\n`;
    css += `}\n\n`;

    // Only generate rules for elements that need explicit positioning
    sortedElements.forEach(([value, pos], index) => {
      const childIndex = index + 1;
      const spans = pos.minRow !== pos.maxRow || pos.minCol !== pos.maxCol;

      // Calculate what the "natural" position would be for this child index
      const naturalRow = Math.floor((childIndex - 1) / numCols) + 1;
      const naturalCol = ((childIndex - 1) % numCols) + 1;
      const isInNaturalPosition = pos.minRow === naturalRow && pos.minCol === naturalCol && !spans;

      // Only add rule if element spans multiple cells or is out of natural order
      if (spans || !isInNaturalPosition) {
        css += `.${className} > *:nth-child(${childIndex}) {\n`;
        css += `  grid-area: ${pos.minRow} / ${pos.minCol} / ${pos.maxRow + 1} / ${pos.maxCol + 1};\n`;
        css += `}\n`;
      }
    });

    return css;
  }

  private generateSpacingCSS(className: string): string {
    const parts = className.split('-');
    const property = parts[0] === 'm' ? 'margin' : 'padding';
    const size = parts[1];

    if (size in this.spacingValues) {
      let css = `.${className} { ${property}: ${this.spacingValues[size]} !important; }\n`;

      // Handle directional variants (mx, my, px, py)
      if (parts.length === 2 && (className.startsWith('mx-') || className.startsWith('my-') || className.startsWith('px-') || className.startsWith('py-'))) {
        const direction = parts[0].substring(1); // 'x' or 'y'
        const dirProperty = direction === 'x' ? `${property}-left, ${property}-right` : `${property}-top, ${property}-bottom`;
        css = `.${className} { ${dirProperty}: ${this.spacingValues[size]} !important; }\n`;
      }

      return css;
    }

    return '';
  }

  private generateFontSizeCSS(className: string): string {
    const size = className.replace('fs-', '');
    if (size in this.fontSizeValues) {
      return `.${className} { font-size: ${this.fontSizeValues[size]}; }\n`;
    }
    return '';
  }

  private generateFontWeightCSS(className: string): string {
    const weight = className.replace('fw-', '');
    const weightMap: Record<string, string> = {
      'normal': '400',
      'bold': '700',
      'light': '300',
      'medium': '500'
    };

    if (weight in weightMap) {
      return `.${className} { font-weight: ${weightMap[weight]}; }\n`;
    }
    return '';
  }

  private generateResponsiveDisplayCSS(className: string): string {
    const parts = className.split('-');
    const action = parts[0]; // 'show' or 'hide'
    const breakpoint = parts[1];

    if (breakpoint in this.breakpoints) {
      const displayValue = action === 'show' ? 'block' : 'none';
      return `@media (min-width: ${this.breakpoints[breakpoint]}) {\n  .${className} { display: ${displayValue} !important; }\n}\n`;
    }

    return '';
  }

  private generateMaxLinesCSS(className: string): string {
    const lines = className.replace('max-lines-', '');
    const lineCount = parseInt(lines);

    if (!isNaN(lineCount)) {
      return `.${className} {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: ${lineCount};\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n`;
    }

    return '';
  }

  private generateDefaultGapCSS(): string {
    return `.gap { gap: calc(0.7em + 0.3vw); }\n`;
  }

  private generateGapCSS(className: string): string {
    const parts = className.split('-');
    const size = parts[1];

    const gapMultipliers: Record<string, number> = {
      'xs': 0.375,
      'sm': 0.75,
      'md': 1, // Default gap size
      'lg': 1.5,
      'xl': 3,
      '2xl': 4.5,
      '3xl': 6
    };

    if (size in gapMultipliers) {
      const gapValue = `calc((0.7em + 0.3vw) * ${gapMultipliers[size]})`;
      return `.${className} { gap: ${gapValue}; }\n`;
    }

    return '';
  }

  private generateAlignmentCSS(className: string): string {
    const alignment = className.replace('align-', '');

    const alignmentMap: Record<string, string> = {
      'tl': 'flex-start left',
      'tc': 'flex-start center',
      'tr': 'flex-start right',
      'ml': 'center left',
      'mc': 'center center',
      'mr': 'center right',
      'bl': 'flex-end left',
      'bc': 'flex-end center',
      'br': 'flex-end right'
    };

    if (alignment in alignmentMap) {
      const [alignContent, textAlign] = alignmentMap[alignment].split(' ');
      return `.${className} {\n  align-content: ${alignContent};\n  align-items: ${alignContent};\n  text-align: ${textAlign};\n}\n`;
    }

    return '';
  }
}