"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSGenerator = void 0;
const vscode = require("vscode");
class CSSGenerator {
    constructor() {
        this.cssCache = new Map();
        this.configCache = null;
        this.configCacheTime = 0;
        this.spacingValues = {
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
        this.fontSizeValues = {
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
        this.colorValues = {
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
        this.breakpoints = {
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
    }
    // Cache configuration for 5 seconds to avoid repeated calls
    getConfig() {
        const now = Date.now();
        if (!this.configCache || (now - this.configCacheTime) > 5000) {
            this.configCache = vscode.workspace.getConfiguration('core4');
            this.configCacheTime = now;
        }
        return this.configCache;
    }
    // Clear caches when configuration changes
    clearCaches() {
        this.cssCache.clear();
        this.configCache = null;
    }
    generateCSS(classes, minify = true) {
        let css = '';
        // Get configuration
        const config = this.getConfig();
        const includeDefaultStyles = config.get('includeDefaultStyles', true);
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
        }
        else {
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
    getCachedClassCSS(className) {
        if (this.cssCache.has(className)) {
            return this.cssCache.get(className);
        }
        const css = this.generateClassCSS(className);
        this.cssCache.set(className, css);
        return css;
    }
    generateClassCSS(className) {
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
        return this.generateUtilityCSS(className);
    }
    // NEW UTILITY METHODS
    generateWidthCSS(className) {
        const widthMap = {
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
    generateHeightCSS(className) {
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
    generateSpaceCSS(className) {
        const match = className.match(/space-(x|y)-([1-8])/);
        if (!match)
            return '';
        const direction = match[1];
        const size = match[2];
        const spacing = this.spacingValues[size];
        if (!spacing)
            return '';
        if (direction === 'x') {
            return `.${className} > * + * { margin-left: ${spacing}; }\n`;
        }
        else {
            return `.${className} > * + * { margin-top: ${spacing}; }\n`;
        }
    }
    isFlexboxClass(className) {
        const flexClasses = [
            'flex', 'flex-col', 'flex-row', 'flex-wrap', 'flex-nowrap',
            'items-start', 'items-center', 'items-end', 'items-stretch',
            'justify-start', 'justify-center', 'justify-between', 'justify-around', 'justify-evenly'
        ];
        return flexClasses.includes(className);
    }
    generateFlexboxCSS(className) {
        const flexMap = {
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
    isTextUtilityClass(className) {
        const textUtils = ['uppercase', 'lowercase', 'capitalize', 'text-center', 'text-left', 'text-right'];
        return textUtils.includes(className);
    }
    generateTextUtilityCSS(className) {
        const textMap = {
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
    generateBorderCSS(className) {
        const config = this.getConfig();
        const borderRadius = config.get('borderRadius', '0.35em');
        const borderMap = {
            'border': 'border: 1px solid #e5e7eb',
            'border-2': 'border: 2px solid #e5e7eb',
            'border-t': 'border-top: 1px solid #e5e7eb',
            'border-r': 'border-right: 1px solid #e5e7eb',
            'border-b': 'border-bottom: 1px solid #e5e7eb',
            'border-l': 'border-left: 1px solid #e5e7eb',
            'rounded': `border-radius: ${borderRadius}`,
            'rounded-sm': 'border-radius: 0.125rem',
            'rounded-lg': 'border-radius: 0.5rem',
            'rounded-full': 'border-radius: 9999px'
        };
        if (className in borderMap) {
            return `.${className} { ${borderMap[className]}; }\n`;
        }
        return '';
    }
    generateOverflowCSS(className) {
        const overflowMap = {
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
    isTextSizeClass(className) {
        const textSizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
        return textSizes.includes(className);
    }
    generateTextSizeCSS(className) {
        const textSizeMap = {
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
    getColorMap(config) {
        return {
            primary: config.get('primaryColor', '#008001'),
            secondary: config.get('secondaryColor', '#005500'),
            highlight: config.get('highlightColor', '#ff6b35'),
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
    generateUtilityCSS(className) {
        const config = this.getConfig();
        const borderRadius = config.get('borderRadius', '0.35em');
        const shadowColor = config.get('shadowColor', 'rgba(0,0,0,0.1)');
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
    // LAYOUT CSS GENERATION (with responsive support)
    generateLayoutCSS(className) {
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
    generateLayoutCSSInternal(className) {
        const pattern = className.replace('layout-', '');
        const rows = pattern.split('-');
        if (rows.length === 0)
            return '';
        const numCols = rows[0].length;
        const numRows = rows.length;
        const getCharValue = (char) => {
            if (char >= '0' && char <= '9')
                return parseInt(char);
            if (char >= 'a' && char <= 'z')
                return 10 + (char.charCodeAt(0) - 'a'.charCodeAt(0));
            return -1;
        };
        const elementPositions = new Map();
        rows.forEach((row, rowIndex) => {
            [...row].forEach((char, colIndex) => {
                const value = getCharValue(char);
                if (value === -1)
                    return;
                if (!elementPositions.has(value)) {
                    elementPositions.set(value, {
                        minRow: rowIndex + 1,
                        maxRow: rowIndex + 1,
                        minCol: colIndex + 1,
                        maxCol: colIndex + 1,
                        firstAppearance: { row: rowIndex, col: colIndex }
                    });
                }
                else {
                    const pos = elementPositions.get(value);
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
            if (rowDiff !== 0)
                return rowDiff;
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
    minifyCSS(css) {
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
    generateBaseStyles() {
        const config = this.getConfig();
        const fontFamily = config.get('fontFamily', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif');
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
    generateElementStyles() {
        const config = this.getConfig();
        const primaryColor = config.get('primaryColor', '#008001');
        const secondaryColor = config.get('secondaryColor', '#005500');
        const borderRadius = config.get('borderRadius', '0.35em');
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
    generateSpacingCSS(className) {
        const parts = className.split('-');
        const property = parts[0] === 'm' ? 'margin' : 'padding';
        const size = parts[1];
        if (size in this.spacingValues) {
            let css = `.${className} { ${property}: ${this.spacingValues[size]} !important; }\n`;
            if (parts.length === 2 && (className.startsWith('mx-') || className.startsWith('my-') || className.startsWith('px-') || className.startsWith('py-'))) {
                const direction = parts[0].substring(1);
                const dirProperty = direction === 'x' ? `${property}-left, ${property}-right` : `${property}-top, ${property}-bottom`;
                css = `.${className} { ${dirProperty}: ${this.spacingValues[size]} !important; }\n`;
            }
            return css;
        }
        return '';
    }
    generateFontSizeCSS(className) {
        const size = className.replace('fs-', '');
        if (size in this.fontSizeValues) {
            return `.${className} { font-size: ${this.fontSizeValues[size]}; }\n`;
        }
        return '';
    }
    generateFontWeightCSS(className) {
        const weight = className.replace('fw-', '');
        const weightMap = {
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
    generateResponsiveDisplayCSS(className) {
        const parts = className.split('-');
        const action = parts[0];
        const breakpoint = parts[1];
        if (breakpoint in this.breakpoints) {
            const displayValue = action === 'show' ? 'block' : 'none';
            return `@media (min-width: ${this.breakpoints[breakpoint]}) {\n  .${className} { display: ${displayValue} !important; }\n}\n`;
        }
        return '';
    }
    generateMaxLinesCSS(className) {
        const lines = className.replace('max-lines-', '');
        const lineCount = parseInt(lines);
        if (!isNaN(lineCount)) {
            return `.${className} {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: ${lineCount};\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n`;
        }
        return '';
    }
    generateDefaultGapCSS() {
        return `.gap { gap: calc(0.7em + 0.3vw); }\n`;
    }
    generateGapCSS(className) {
        const parts = className.split('-');
        const size = parts[1];
        const gapMultipliers = {
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
            return `.${className} { gap: ${gapValue}; }\n`;
        }
        return '';
    }
    generateAlignmentCSS(className) {
        const alignment = className.replace('align-', '');
        const alignmentMap = {
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
exports.CSSGenerator = CSSGenerator;
//# sourceMappingURL=cssGenerator.js.map