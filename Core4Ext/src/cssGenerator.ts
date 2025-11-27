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

  // Display utility values
  private displayValues: Record<string, string> = {
    'off': 'none',
    'block': 'block',
    'inline': 'inline',
    'inline-block': 'inline-block',
    'flex': 'flex',
    'grid': 'grid'
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

    // Get configuration
    const config = this.getConfig();
    const includeDefaultStyles = config.get<boolean>('includeDefaultStyles', true);

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

  private generateClassCSS(className: string): string {
    // Layout classes (including responsive)
    if (className.startsWith('layout-')) {
      return this.generateLayoutCSS(className);
    }

    // Width classes
    if (className.startsWith('w-')) {
      return this.generateWidthCSS(className);
    }

    // Height classes
    if (className.startsWith('h-')) {
      return this.generateHeightCSS(className);
    }

    // Space classes
    if (className.startsWith('space-')) {
      return this.generateSpaceCSS(className);
    }

    // Flexbox classes
    if (this.isFlexboxClass(className)) {
      return this.generateFlexboxCSS(className);
    }

    // Text utility classes
    if (this.isTextUtilityClass(className)) {
      return this.generateTextUtilityCSS(className);
    }

    // Border and rounded classes
    if (className.startsWith('border') || className.startsWith('rounded')) {
      return this.generateBorderCSS(className);
    }

    // Overflow classes
    if (className.startsWith('overflow-')) {
      return this.generateOverflowCSS(className);
    }

    // Text size classes (alternative to fs-)
    if (className.startsWith('text-') && this.isTextSizeClass(className)) {
      return this.generateTextSizeCSS(className);
    }

    // Spacing classes (margin/padding) - must match m-, mx-, my-, ml-, mr-, mt-, mb-, p-, px-, py-, pl-, pr-, pt-, pb-
    if (className.match(/^[mp][lrtbxy]?-/)) {
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
    const colorMap = this.getColorMap(config);

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

    // Display utility classes (d-off, d-block, etc.)
    if (className.startsWith('d-')) {
      return this.generateDisplayUtilityCSS(className);
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

    // Special layout patterns
    if (className === 'layout-12-33') {
      return this.generateLayout1233CSS();
    }

    // Utility classes
    return this.generateUtilityCSS(className);
  }

  // NEW UTILITY METHODS

  private generateWidthCSS(className: string): string {
    const widthMap: Record<string, string> = {
      'w-full': '100%',
      'w-1/2': '50%',
      'w-1/3': '33.333333%',
      'w-2/3': '66.666667%',
      'w-1/4': '25%',
      'w-3/4': '75%',
      'w-screen': '100vw'
    };

    if (className in widthMap) {
      return `.${className} { width: ${widthMap[className]}; }\n`;
    }
    return '';
  }

  private generateHeightCSS(className: string): string {
    if (className === 'h-screen') {
      return `.${className} { height: 100vh; }\n`;
    }
    if (className === 'h-full') {
      return `.${className} { height: 100%; }\n`;
    }
    if (className === 'h-auto') {
      return `.${className} { height: auto; }\n`;
    }

    // Handle numeric heights like h-64
    const match = className.match(/h-(\d+)/);
    if (match) {
      const value = parseInt(match[1]) * 0.25; // 0.25rem per unit
      return `.${className} { height: ${value}rem; }\n`;
    }

    return '';
  }

  private generateSpaceCSS(className: string): string {
    const match = className.match(/space-(x|y)-([1-8])/);
    if (!match) return '';

    const direction = match[1];
    const size = match[2];
    const spacing = this.spacingValues[size];

    if (!spacing) return '';

    if (direction === 'x') {
      return `.${className} > * + * { margin-left: ${spacing}; }\n`;
    } else {
      return `.${className} > * + * { margin-top: ${spacing}; }\n`;
    }
  }

  private isFlexboxClass(className: string): boolean {
    const flexClasses = [
      'flex', 'flex-col', 'flex-row', 'flex-wrap', 'flex-nowrap',
      'items-start', 'items-center', 'items-end', 'items-stretch',
      'justify-start', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly'
    ];
    return flexClasses.includes(className);
  }

  private generateFlexboxCSS(className: string): string {
    const flexMap: Record<string, string> = {
      'flex': 'display: flex',
      'flex-col': 'display: flex; flex-direction: column',
      'flex-row': 'display: flex; flex-direction: row',
      'flex-wrap': 'flex-wrap: wrap',
      'flex-nowrap': 'flex-wrap: nowrap',
      'items-start': 'align-items: flex-start',
      'items-center': 'align-items: center',
      'items-end': 'align-items: flex-end',
      'items-stretch': 'align-items: stretch',
      'justify-start': 'justify-content: flex-start',
      'justify-center': 'justify-content: center',
      'justify-between': 'justify-content: space-between',
      'justify-around': 'justify-content: space-around',
      'justify-evenly': 'justify-content: space-evenly'
    };

    if (className in flexMap) {
      return `.${className} { ${flexMap[className]}; }\n`;
    }
    return '';
  }

  private isTextUtilityClass(className: string): boolean {
    const textUtils = ['uppercase', 'lowercase', 'capitalize', 'text-center', 'text-left', 'text-right'];
    return textUtils.includes(className);
  }

  private generateTextUtilityCSS(className: string): string {
    const textMap: Record<string, string> = {
      'uppercase': 'text-transform: uppercase',
      'lowercase': 'text-transform: lowercase',
      'capitalize': 'text-transform: capitalize',
      'text-center': 'text-align: center',
      'text-left': 'text-align: left',
      'text-right': 'text-align: right'
    };

    if (className in textMap) {
      return `.${className} { ${textMap[className]}; }\n`;
    }
    return '';
  }

  private generateBorderCSS(className: string): string {
    const config = this.getConfig();
    const borderRadius = config.get<string>('borderRadius', '0.35em');

    const borderMap: Record<string, string> = {
      'border': 'border: 1px solid #e5e7eb',
      'border-2': 'border: 2px solid #e5e7eb',
      'border-t': 'border-top: 1px solid #e5e7eb',
      'border-r': 'border-right: 1px solid #e5e7eb',
      'border-b': 'border-bottom: 1px solid #e5e7eb',
      'border-l': 'border-left: 1px solid #e5e7eb',
      'rounded': `border-radius: ${borderRadius}`,
      'rounded-sm': 'border-radius: 0.125rem',
      'rounded-lg': 'border-radius: 0.5rem',
      'rounded-full': 'border-radius: 9999px',
      'radius': `border-radius: ${borderRadius}`,
      'radius-sm': 'border-radius: 4px',
      'radius-lg': 'border-radius: 0.7em',
      'radius-xl': 'border-radius: 40px'
    };

    if (className in borderMap) {
      return `.${className} { ${borderMap[className]}; }\n`;
    }
    return '';
  }

  private generateOverflowCSS(className: string): string {
    const overflowMap: Record<string, string> = {
      'overflow-hidden': 'overflow: hidden',
      'overflow-auto': 'overflow: auto',
      'overflow-scroll': 'overflow: scroll',
      'overflow-visible': 'overflow: visible'
    };

    if (className in overflowMap) {
      return `.${className} { ${overflowMap[className]}; }\n`;
    }
    return '';
  }

  private isTextSizeClass(className: string): boolean {
    const textSizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
    return textSizes.includes(className);
  }

  private generateTextSizeCSS(className: string): string {
    const textSizeMap: Record<string, string> = {
      'text-xs': '0.75rem',
      'text-sm': '0.875rem',
      'text-base': '1rem',
      'text-lg': '1.125rem',
      'text-xl': '1.25rem',
      'text-2xl': '1.5rem',
      'text-3xl': '1.875rem'
    };

    const size = textSizeMap[className];
    if (size) {
      return `.${className} { font-size: ${size}; }\n`;
    }
    return '';
  }

  private getColorMap(config: vscode.WorkspaceConfiguration): Record<string, string> {
    return {
      primary: config.get<string>('primaryColor', '#008001'),
      secondary: config.get<string>('secondaryColor', '#005500'),
      highlight: config.get<string>('highlightColor', '#ff6b35'),
      danger: '#dc3545',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
      black: '#000000',
      white: '#ffffff',
      'grey-lightest': '#f8f9fa',
      'grey-darkest': '#343a40',
      'trans-grey': 'rgba(0,0,0,0.1)',
      'trans-black': 'rgba(0,0,0,0.8)',
      'dark-violet': '#4a148c',
      'light-violet': '#e1bee7'
    };
  }

  private generateUtilityCSS(className: string): string {
    const config = this.getConfig();
    const borderRadius = config.get<string>('borderRadius', '0.35em');
    const shadowColor = config.get<string>('shadowColor', 'rgba(0,0,0,0.1)');

    switch (className) {
      case 'container':
        return `.${className} { width: 100%; max-width: 1550px; margin: 0 auto; }\n`;
      case 'container-sm':
        return `.${className} { width: 100%; max-width: 1395px; margin: 0 auto; }\n`;
      case 'container-lg':
        return `.${className} { width: 100%; max-width: 1782.5px; margin: 0 auto; }\n`;
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
      case 'box-shadow':
        return `.${className} { box-shadow: 20px 20px 30px rgba(0,0,0,0.3); }\n`;
      case 'hover-border':
        return `.${className} { border: 2px solid transparent; transition: border-color 0.3s; }\n.${className}:hover, .${className}:focus { border-color: currentColor; }\n`;
      case 'setup':
        return `.${className} > *:nth-child(1) { background: #e3f2fd !important; }\n.${className} > *:nth-child(2) { background: #e8f5e9 !important; }\n.${className} > *:nth-child(3) { background: #fff9c4 !important; }\n.${className} > *:nth-child(4) { background: #ffe0b2 !important; }\n.${className} > *:nth-child(5) { background: #f3e5f5 !important; }\n.${className} > *:nth-child(6) { background: #fce4ec !important; }\n`;
      case 'slider':
        return `.${className} { position: relative; overflow: hidden; }\n.${className} > * { display: none; }\n.${className} > *:first-child { display: block; }\n`;
      case 'slider-dots':
        return `.${className}.slider { padding-bottom: 2em; }\n`;
      case 'slider-bar':
        return `.${className}.slider { padding-bottom: 0.5em; }\n`;
      case 'zoomee':
        return `.${className} { display: flex; gap: 0.5em; cursor: pointer; }\n.${className} img { max-width: 100%; height: auto; transition: transform 0.3s; }\n.${className} img:hover { transform: scale(1.05); }\n`;
      case 'readMore':
        return `.${className} { position: relative; }\n.${className}.truncated::after { content: '...'; position: absolute; bottom: 0; right: 0; }\n`;
    }

    // Handle responsive slider disable classes (slider-sm-off, slider-md-off, etc.)
    const sliderOffMatch = className.match(/slider-(sm|mm|lm|st|mt|lt|sd|md|ld)-off/);
    if (sliderOffMatch) {
      const breakpoint = sliderOffMatch[1];
      if (breakpoint in this.breakpoints) {
        return `@media (min-width: ${this.breakpoints[breakpoint]}) {\n  .${className} > * { display: block !important; }\n}\n`;
      }
    }

    return '';
  }

  // LAYOUT CSS GENERATION (with responsive support)
  private generateLayoutCSS(className: string): string {
    // Check for responsive layout first
    const responsiveMatch = className.match(/layout-([a-z]{2})-(.+)/);
    if (responsiveMatch) {
      const breakpoint = responsiveMatch[1];
      const pattern = responsiveMatch[2];

      if (breakpoint in this.breakpoints) {
        const baseCSS = this.generateLayoutCSSInternal(`layout-${pattern}`);
        // Wrap in media query
        return `@media (min-width: ${this.breakpoints[breakpoint]}) {\n${baseCSS.replace(/\n/g, '\n  ')}\n}\n`;
      }
    }

    return this.generateLayoutCSSInternal(className);
  }

  private generateLayoutCSSInternal(className: string): string {
    const pattern = className.replace('layout-', '');
    const rows = pattern.split('-');

    if (rows.length === 0) return '';

    const numCols = rows[0].length;
    const numRows = rows.length;

    const getCharValue = (char: string): number => {
      if (char >= '0' && char <= '9') return parseInt(char);
      if (char >= 'a' && char <= 'z') return 10 + (char.charCodeAt(0) - 'a'.charCodeAt(0));
      return -1;
    };

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
        if (value === -1) return;

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

    const sortedElements = Array.from(elementPositions.entries())
      .sort(([a, posA], [b, posB]) => {
        const rowDiff = posA.firstAppearance.row - posB.firstAppearance.row;
        if (rowDiff !== 0) return rowDiff;
        return posA.firstAppearance.col - posB.firstAppearance.col;
      });

    let css = `.${className} {\n`;
    css += `  display: grid;\n`;
    css += `  grid: repeat(${numRows}, 1fr) / repeat(${numCols}, 1fr);\n`;
    css += `}\n\n`;

    sortedElements.forEach(([value, pos], index) => {
      const childIndex = index + 1;
      const spans = pos.minRow !== pos.maxRow || pos.minCol !== pos.maxCol;

      const naturalRow = Math.floor((childIndex - 1) / numCols) + 1;
      const naturalCol = ((childIndex - 1) % numCols) + 1;
      const isInNaturalPosition = pos.minRow === naturalRow && pos.minCol === naturalCol && !spans;

      if (spans || !isInNaturalPosition) {
        css += `.${className} > *:nth-child(${childIndex}) {\n`;
        css += `  grid-area: ${pos.minRow} / ${pos.minCol} / ${pos.maxRow + 1} / ${pos.maxCol + 1};\n`;
        css += `}\n`;
      }
    });

    return css;
  }

  // EXISTING METHODS (unchanged)
  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*,\s*/g, ',')
      .trim();
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

  private generateSpacingCSS(className: string): string {
    // Match patterns:
    // m-1, p-2 (all sides)
    // mx-1, my-2, px-3, py-4 (x/y axis)
    // ml-1, mr-2, mt-3, mb-4, pl-1, pr-2, pt-3, pb-4 (individual sides)
    // m-sm-2, p-md-3 (responsive)
    // mx-sm-2, py-md-3 (responsive x/y axis)
    // ml-sm-1, pt-md-2 (responsive individual sides)
    
    const parts = className.split('-');
    const baseProperty = parts[0].charAt(0) === 'm' ? 'margin' : 'padding';
    
    // Check for directional suffix (l, r, t, b, x, y)
    const direction = parts[0].length > 1 ? parts[0].substring(1) : '';
    
    // Check if responsive (has breakpoint)
    let breakpoint = '';
    let sizeIndex = 1;
    if (parts.length > 2 && parts[1] in this.breakpoints) {
      breakpoint = parts[1];
      sizeIndex = 2;
    }
    
    const size = parts[sizeIndex];
    
    if (!(size in this.spacingValues)) {
      return '';
    }
    
    const value = this.spacingValues[size];
    let cssRule = '';
    
    // Generate the appropriate CSS based on direction
    if (direction === 'x') {
      cssRule = `${baseProperty}-left: ${value} !important; ${baseProperty}-right: ${value} !important;`;
    } else if (direction === 'y') {
      cssRule = `${baseProperty}-top: ${value} !important; ${baseProperty}-bottom: ${value} !important;`;
    } else if (direction === 'l') {
      cssRule = `${baseProperty}-left: ${value} !important;`;
    } else if (direction === 'r') {
      cssRule = `${baseProperty}-right: ${value} !important;`;
    } else if (direction === 't') {
      cssRule = `${baseProperty}-top: ${value} !important;`;
    } else if (direction === 'b') {
      cssRule = `${baseProperty}-bottom: ${value} !important;`;
    } else {
      cssRule = `${baseProperty}: ${value} !important;`;
    }
    
    // Wrap in media query if responsive
    if (breakpoint) {
      return `@media (min-width: ${this.breakpoints[breakpoint]}) {\n  .${className} { ${cssRule} }\n}\n`;
    }
    
    return `.${className} { ${cssRule} }\n`;
  }

  private generateFontSizeCSS(className: string): string {
    // Check if responsive (fs-sm-3xl, fs-md-lg, etc.)
    const parts = className.replace('fs-', '').split('-');
    let breakpoint = '';
    let sizeIndex = 0;
    
    if (parts.length > 1 && parts[0] in this.breakpoints) {
      breakpoint = parts[0];
      sizeIndex = 1;
    }
    
    const size = parts[sizeIndex];
    
    if (size in this.fontSizeValues) {
      const cssRule = `font-size: ${this.fontSizeValues[size]};`;
      
      if (breakpoint) {
        return `@media (min-width: ${this.breakpoints[breakpoint]}) {\n  .${className} { ${cssRule} }\n}\n`;
      }
      
      return `.${className} { ${cssRule} }\n`;
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

  private generateDisplayUtilityCSS(className: string): string {
    const parts = className.split('-');
    
    // Check for responsive display utilities (d-sm-off, d-md-block, etc.)
    if (parts.length === 3 && parts[1] in this.breakpoints) {
      const breakpoint = parts[1];
      const displayType = parts[2];
      
      if (displayType in this.displayValues) {
        const displayValue = this.displayValues[displayType];
        return `@media (min-width: ${this.breakpoints[breakpoint]}) {\n  .${className} { display: ${displayValue} !important; }\n}\n`;
      }
    }
    
    // Check for base display utilities (d-off, d-block, etc.)
    if (parts.length === 2) {
      const displayType = parts[1];
      
      if (displayType in this.displayValues) {
        const displayValue = this.displayValues[displayType];
        return `.${className} { display: ${displayValue} !important; }\n`;
      }
    }
    
    return '';
  }

  private generateResponsiveDisplayCSS(className: string): string {
    const parts = className.split('-');
    const action = parts[0];
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

  private generateLayout1233CSS(): string {
    return `.layout-12-33 {\n  display: grid;\n  grid-template-areas:\n    "element1 element2"\n    "element3 element3";\n}\n.layout-12-33 > :first-child {\n  grid-area: element1;\n}\n.layout-12-33 > :nth-child(2) {\n  grid-area: element2;\n}\n.layout-12-33 > :nth-child(3) {\n  grid-area: element3;\n}\n`;
  }

  private generateGapCSS(className: string): string {
    const parts = className.split('-');
    
    // Check if responsive (gap-sm-lg, gap-md-xl, etc.)
    let breakpoint = '';
    let sizeIndex = 1;
    if (parts.length > 2 && parts[1] in this.breakpoints) {
      breakpoint = parts[1];
      sizeIndex = 2;
    }
    
    const size = parts[sizeIndex];

    const gapMultipliers: Record<string, number> = {
      'xs': 0.375,
      'sm': 0.75,
      'md': 1,
      'lg': 1.5,
      'xl': 3,
      '2xl': 4.5,
      '3xl': 6
    };

    if (size in gapMultipliers) {
      const gapValue = `calc((0.7em + 0.3vw) * ${gapMultipliers[size]})`;
      
      if (breakpoint) {
        return `@media (min-width: ${this.breakpoints[breakpoint]}) {\n  .${className} { gap: ${gapValue}; }\n}\n`;
      }
      
      return `.${className} { gap: ${gapValue}; }\n`;
    }

    return '';
  }

  private generateAlignmentCSS(className: string): string {
    // Check if responsive (align-sm-mc, align-md-tr, etc.)
    const parts = className.split('-');
    let breakpoint = '';
    let alignmentIndex = 1;
    
    if (parts.length > 2 && parts[1] in this.breakpoints) {
      breakpoint = parts[1];
      alignmentIndex = 2;
    }
    
    const alignment = parts[alignmentIndex];

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
      const cssRule = `align-content: ${alignContent}; align-items: ${alignContent}; text-align: ${textAlign};`;
      
      if (breakpoint) {
        return `@media (min-width: ${this.breakpoints[breakpoint]}) {\n  .${className} { ${cssRule} }\n}\n`;
      }
      
      return `.${className} { ${cssRule} }\n`;
    }

    return '';
  }
}