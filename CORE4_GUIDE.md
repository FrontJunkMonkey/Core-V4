# Core4 Framework Guide

## Philosophy
Core4 follows one principle: **"Use the most natural, universal term that a developer would actually type."**

## Naming Convention Rules

### 1. Abbreviate When Unambiguous
Only abbreviate when the letter(s) could ONLY mean one thing:

✅ **Good:**
- `m-` (margin) - what else could 'm' mean in CSS?
- `p-` (padding) - what else could 'p' mean in CSS?
- `fs-` (font-size) - what else could 'fs' mean in CSS?
- `mxw`, `mxh`, `mnw`, `mnh` (max/min width/height)

❌ **Bad:**
- `p-relative` - 'p' could mean padding, position, primary, etc.
- `r-` (radius) - 'r' could mean radius, right, red, etc.

### 2. Use Full Words When Ambiguous
When abbreviation could mean multiple things, use full word:

✅ **Good:**
- `radius` (not `r-` or `bradius`)
- `relative`, `absolute`, `fixed` (not `pos-relative`)
- `left`, `center`, `right` (not `text-left`)
- `show`, `hide` (not `d-off`, `d-block`)

### 3. Contextual Abbreviation
When context makes it unambiguous, abbreviate more aggressively:

- `absolute`, `relative`, `fixed` - These ONLY exist in `position` context
- `mxw`, `mxh`, `mnw`, `mnh` - Completely unambiguous

## Core Classes

### Layout System

Core4's layout system is **NOT a traditional grid**. It's **explicit child-to-row mapping** that gives you complete control over how children are arranged.

#### How It Works

The class `layout-123-456` means:
- **Children 1, 2, 3** go in the **first row**
- **Children 4, 5, 6** go in the **second row**

```
layout-123-456
┌─────────────────┐
│ Child1 │ Child2 │ Child3 │  ← Row 1
├─────────────────┤
│ Child4 │ Child5 │ Child6 │  ← Row 2
└─────────────────┘
```

#### Examples

**Simple 2x3 Grid:**
```html
<div class="layout-123-456">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
  <div>Four</div>
  <div>Five</div>
  <div>Six</div>
</div>
```

**Hero Section (1 item spans full width):**
```html
<div class="layout-1-23-45">
  <h1>Hero Title</h1>          <!-- Row 1: Full width -->
  <p>Subtitle</p>              <!-- Row 2: Left side -->
  <button>Learn More</button>   <!-- Row 2: Right side -->
</div>
```

**Sidebar Layout:**
```html
<div class="layout-12-34">
  <nav>Sidebar</nav>           <!-- Row 1: Left side -->
  <main>Content</main>         <!-- Row 1: Right side -->
  <footer>Footer</footer>      <!-- Row 2: Full width -->
</div>
```

**Complex Overlapping Layout:**
```html
<div class="layout-123-124">
  <div>Header</div>            <!-- Row 1: Left -->
  <div>Nav</div>              <!-- Row 1: Middle -->
  <div>Content</div>           <!-- Row 1: Right -->
  <div>Footer</div>            <!-- Row 2: Left (spans both rows) -->
</div>
```

#### Why Not "Grid"?

Traditional CSS Grid uses columns and rows. Core4's layout system uses **explicit child positioning**:

- **CSS Grid:** `grid-template-columns: 1fr 1fr 1fr;`
- **Core4 Layout:** `layout-123-456` (explicit child mapping)

This gives you **precise control** without memorizing grid syntax.

### Spacing
```html
<div class="m-1">          <!-- margin: 0.6em -->
<div class="m-sm-2">       <!-- margin: 1.2em on small screens -->
<div class="mx-3">         <!-- margin-left/right: 1.8em -->
<div class="p-1">          <!-- padding: 0.6em -->
```

### Typography
```html
<h1 class="fs-3xl">        <!-- font-size: 35px -->
<p class="fs-md">          <!-- font-size: 16px -->
<p class="left">           <!-- text-align: left -->
<p class="center">         <!-- text-align: center -->
```

### Positioning
```html
<div class="relative">     <!-- position: relative -->
<div class="absolute">     <!-- position: absolute -->
<div class="fixed">        <!-- position: fixed -->
```

### Display
```html
<div class="show">         <!-- display: block -->
<div class="hide">         <!-- display: none -->
<div class="show-sm">      <!-- display: block on small screens -->
<div class="hide-md">      <!-- display: none on medium screens -->
```

### Visual Effects
```html
<div class="radius">       <!-- border-radius: 0.35em -->
<div class="shadow">       <!-- box-shadow: 0 4px 6px rgba(0,0,0,0.1) -->
```

### Colors
```html
<div class="primary">      <!-- color: #008001 -->
<div class="secondary">    <!-- color: #005500 -->
<div class="black">        <!-- color: #0e0e0e -->
<div class="white">        <!-- color: #fff -->
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
- `sm`: 320px (Small mobile)
- `mm`: 386px (Medium mobile)
- `lm`: 466px (Large mobile)
- `st`: 562px (Small tablet)
- `mt`: 678px (Medium tablet)
- `lt`: 818px (Large tablet)
- `sd`: 987px (Small desktop)
- `md`: 1191px (Medium desktop)
- `ld`: 1500px (Large desktop)

## Usage Example
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
            <p class="fs-md">This is a responsive layout</p>
        </div>
    </div>
</body>
</html>
``` 