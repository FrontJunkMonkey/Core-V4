# Core4 Framework

A lightweight, intuitive CSS framework designed for modern web development with a focus on developer experience and natural naming conventions.

## Philosophy

Core4 follows a simple principle: **"Use the most natural, universal term that a developer would actually type."**

- No Bootstrap-specific terminology
- Intuitive abbreviations only when unambiguous
- Universal terms that work across cultures and languages
- Minimal learning curve

## Naming Convention

### Rule 1: Abbreviate When Unambiguous
Only abbreviate when the letter(s) could ONLY mean one thing:

✅ **Good Abbreviations:**
- `m-` (margin) - what else could 'm' mean in CSS?
- `p-` (padding) - what else could 'p' mean in CSS?
- `fs-` (font-size) - what else could 'fs' mean in CSS?
- `mxw`, `mxh`, `mnw`, `mnh` (max/min width/height) - completely unambiguous

❌ **Bad Abbreviations:**
- `p-relative` - 'p' could mean padding, position, primary, etc.
- `r-` (radius) - 'r' could mean radius, right, red, etc.

### Rule 2: Use Full Words When Ambiguous
When the abbreviation could mean multiple things, use the full word:

✅ **Good Full Words:**
- `radius` (not `r-` or `bradius`)
- `relative`, `absolute`, `fixed` (not `pos-relative`)
- `left`, `center`, `right` (not `text-left`)
- `hidden`, `block` (not `d-off`, `d-block`)

### Rule 3: Contextual Abbreviation
When the context makes it unambiguous, you can abbreviate more aggressively:

- `absolute`, `relative`, `fixed` - These words ONLY exist in the context of `position`
- `mxw`, `mxh`, `mnw`, `mnh` - These are completely unambiguous

## Core Classes

### Layout System
```html
<!-- Explicit child-to-row mapping -->
<div class="layout-123-456">  <!-- Children 1,2,3 in first row; 4,5,6 in second row -->
<div class="layout-123-124">  <!-- Children 1,2,3 in first row; 1,2,4 in second row (1 and 2 span both rows) -->
```

**Example:**
```html
<div class="layout-123-456">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
  <div>Four</div>
  <div>Five</div>
  <div>Six</div>
</div>
<!-- Renders as:
Row 1: One | Two | Three
Row 2: Four | Five | Six
-->

<div class="layout-123-124">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
  <div>Four</div>
</div>
<!-- Renders as:
Row 1: One | Two | Three
Row 2: One | Two | Four (One and Two span both rows)
-->
```

This is not a column or percentage-based grid, but a direct mapping of children to rows, allowing for overlaps and custom arrangements.

### Spacing
```html
<!-- Margin -->
<div class="m-1">          <!-- margin: 0.6em -->
<div class="m-sm-2">       <!-- margin: 1.2em on small screens -->
<div class="mx-3">         <!-- margin-left/right: 1.8em -->
<div class="my-4">         <!-- margin-top/bottom: 2.4em -->
<div class="ml-2">         <!-- margin-left: 1.2em -->

<!-- Padding -->
<div class="p-1">          <!-- padding: 0.6em -->
<div class="p-sm-2">       <!-- padding: 1.2em on small screens -->
```

### Typography
```html
<!-- Font sizes -->
<h1 class="fs-3xl">        <!-- font-size: 35px -->
<p class="fs-md">          <!-- font-size: 16px -->
<span class="fs-sm">       <!-- font-size: 14px -->

<!-- Text alignment -->
<p class="left">           <!-- text-align: left -->
<p class="center">         <!-- text-align: center -->
<p class="right">          <!-- text-align: right -->
```

### Positioning
```html
<div class="relative">     <!-- position: relative -->
<div class="absolute">     <!-- position: absolute -->
<div class="fixed">        <!-- position: fixed -->
```

### Display
```html
<div class="hidden">       <!-- display: none -->
<div class="block">        <!-- display: block -->

<!-- Responsive display -->
<div class="show-sm">      <!-- display: initial on small screens -->
<div class="hide-md">      <!-- display: none on medium screens -->
<div class="block-lg">     <!-- display: block on large screens -->
```

### Visual Effects
```html
<div class="radius">       <!-- border-radius: 0.35em -->
<div class="radius-sm">    <!-- border-radius: 4px -->
<div class="radius-lg">    <!-- border-radius: 0.7em -->
<div class="radius-xl">    <!-- border-radius: 40px -->
```

### Colors
```html
<div class="primary">      <!-- background-color: #008001 -->
<div class="secondary">    <!-- background-color: #005500 -->
<div class="highlight">    <!-- background-color: #FFB613 -->
<div class="danger">       <!-- background-color: #B71234 -->
```

### Interactive Elements
```html
<div class="slider">       <!-- Carousel/slider functionality -->
<div class="items">        <!-- Grid of items -->
<div class="list">         <!-- List of things -->
<div class="expand">       <!-- Expandable content -->
<div class="popup">        <!-- Popup/overlay -->
```

## Breakpoints

Core4 uses a comprehensive breakpoint system:

- `sm`: 320px (Small mobile)
- `mm`: 386px (Medium mobile)
- `lm`: 466px (Large mobile)
- `st`: 562px (Small tablet)
- `mt`: 678px (Medium tablet)
- `lt`: 818px (Large tablet)
- `sd`: 987px (Small desktop)
- `md`: 1191px (Medium desktop)
- `ld`: 1500px (Large desktop)

## Usage

### Basic Setup
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="assets/styles/core.css">
</head>
<body>
    <div class="container">
        <h1 class="fs-3xl center">Hello Core4</h1>
        <div class="layout-6-50 m-2">
            <p class="fs-md">This is a responsive layout</p>
        </div>
    </div>
</body>
</html>
```

### Responsive Design
```html
<div class="layout-12-33 m-1 m-sm-2 m-md-3">
    <h2 class="fs-xl fs-sm-2xl fs-md-3xl">Responsive Typography</h2>
    <p class="hidden show-sm">Visible on small screens and up</p>
    <p class="block hide-md">Hidden on medium screens and up</p>
</div>
```

## Development

### Building CSS
The framework uses SCSS for development. To build:

1. Compile `assets/styles/dev/core.scss` to `assets/styles/core.css`
2. Use the layout generator tool in `/tools/` to scan for used classes
3. The system will automatically generate optimized CSS

### Layout Generator
The layout generator tool scans HTML files for Core4 classes and generates optimized CSS. This ensures only used classes are included in the final build.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills for CSS Grid)
- Mobile browsers

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]
