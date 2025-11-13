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

#### Slider/Carousel
```html
<div class="slider">                    <!-- Basic auto-sliding carousel -->
<div class="slider slider-dots">       <!-- Carousel with dot navigation -->
<div class="slider slider-bar">        <!-- Carousel with progress bar -->
<div class="slider slider-sd-off">     <!-- Disable on small desktop+ -->
```

#### Image Gallery with Zoom
```html
<div class="zoomee">                    <!-- Image gallery with zoom capability -->
  <img src="image1.jpg" alt="Image 1">
  <img src="image2.jpg" alt="Image 2">
  <img src="image3.jpg" alt="Image 3">
</div>
```

#### Text Truncation with Read More
```html
<div class="readMore max-lines-3">     <!-- Show 3 lines with read more button -->
  <p>Long text content that will be truncated...</p>
</div>
```

#### Interactive Borders
```html
<div class="hover-border">             <!-- Border appears on hover/focus -->
  Content with interactive border
</div>
```

### Advanced Layout & Alignment

#### Container Variations
```html
<div class="container">                <!-- Max-width: 1550px -->
<div class="container-sm">             <!-- Max-width: 1395px -->
<div class="container-lg">             <!-- Max-width: 1782.5px -->
```

#### Gap System
```html
<div class="gap">                      <!-- Default gap -->
<div class="gap-xs">                   <!-- Extra small gap -->
<div class="gap-sm">                   <!-- Small gap -->
<div class="gap-lg">                   <!-- Large gap -->
<div class="gap-xl">                   <!-- Extra large gap -->
<div class="gap-2xl">                  <!-- 2x extra large gap -->
<div class="gap-3xl">                  <!-- 3x extra large gap -->
<div class="gap-sm-lg">                <!-- Large gap on small screens+ -->
```

#### Alignment System
```html
<div class="align-tl">                 <!-- Top-left alignment -->
<div class="align-tc">                 <!-- Top-center alignment -->
<div class="align-tr">                 <!-- Top-right alignment -->
<div class="align-ml">                 <!-- Middle-left alignment -->
<div class="align-mc">                 <!-- Middle-center alignment -->
<div class="align-mr">                 <!-- Middle-right alignment -->
<div class="align-bl">                 <!-- Bottom-left alignment -->
<div class="align-bc">                 <!-- Bottom-center alignment -->
<div class="align-br">                 <!-- Bottom-right alignment -->
<div class="align-sm-mc">              <!-- Middle-center on small screens+ -->
```

#### Text Line Clamping
```html
<p class="max-lines-1">                <!-- Clamp to 1 line -->
<p class="max-lines-3">                <!-- Clamp to 3 lines -->
<p class="max-lines-5">                <!-- Clamp to 5 lines -->
<!-- Available: max-lines-1 through max-lines-15 -->
```

### Enhanced Visual Effects
```html
<div class="radius">                   <!-- border-radius: 0.35em -->
<div class="radius-sm">                <!-- border-radius: 4px -->
<div class="radius-lg">                <!-- border-radius: 0.7em -->
<div class="radius-xl">                <!-- border-radius: 40px -->
<div class="box-shadow">               <!-- 20px 20px 30px rgba(0,0,0,0.3) -->
<div class="overflow-hidden">          <!-- overflow: hidden -->
```

### Development Helper
```html
<div class="setup">                    <!-- Colored backgrounds for layout debugging -->
  <div>Child 1 - Blue background</div>
  <div>Child 2 - Green background</div>
  <div>Child 3 - Yellow background</div>
</div>
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

## JavaScript Components

Core4 includes several JavaScript components that activate automatically:

### Auto-Slider
```html
<!-- Basic auto-rotating carousel -->
<div class="slider">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</div>

<!-- With dot navigation -->
<div class="slider slider-dots">
  <div>Slide 1</div>
  <div>Slide 2</div>
</div>

<!-- With progress bar -->
<div class="slider slider-bar">
  <div>Slide 1</div>
  <div>Slide 2</div>
</div>
```

### Zoomee Image Gallery
```html
<!-- Automatic image gallery with zoom -->
<div class="zoomee">
  <img src="product1.jpg" alt="Product view 1">
  <img src="product2.jpg" alt="Product view 2">
  <img src="product3.jpg" alt="Product view 3">
</div>
```
- Click any image to zoom
- Navigate with arrow buttons or thumbnails  
- Swipe support on mobile
- Keyboard navigation (ESC to close)

### Read More Text Truncation
```html
<!-- Text that auto-truncates with expand button -->
<div class="readMore max-lines-3">
  <p>Very long text content that will be automatically truncated to 3 lines and show a "Read more" button when it overflows...</p>
</div>
```

To include JavaScript functionality:
```html
<script src="assets/scripts/async.js"></script>
<script src="assets/scripts/core-slider.js"></script>
<script src="assets/scripts/zoomee.js"></script>
```

## Usage Example
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="assets/styles/core.css">
</head>
<body>
    <div class="container">
        <h1 class="fs-3xl center">Hello Core4</h1>
        
        <!-- Image Gallery -->
        <div class="zoomee m-2">
            <img src="image1.jpg" alt="Gallery Image 1">
            <img src="image2.jpg" alt="Gallery Image 2">
        </div>
        
        <!-- Auto Slider -->
        <div class="slider slider-dots m-2">
            <div class="p-3 bg-primary white center">Slide 1</div>
            <div class="p-3 bg-secondary white center">Slide 2</div>
            <div class="p-3 bg-highlight white center">Slide 3</div>
        </div>
        
        <!-- Responsive Layout -->
        <div class="layout-12-34 gap m-2">
            <div class="readMore max-lines-2">
                <p>This is a responsive layout with automatic text truncation functionality...</p>
            </div>
            <button class="hover-border">Interactive Button</button>
        </div>
    </div>
    
    <script src="assets/scripts/async.js"></script>
    <script src="assets/scripts/core-slider.js"></script>
    <script src="assets/scripts/zoomee.js"></script>
</body>
</html>
``` 