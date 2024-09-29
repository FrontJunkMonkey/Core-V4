# Core-v4 SCSS Framework (In Development)

An innovative SCSS framework concept, currently in development, designed to revolutionise web layout creation and streamline the overall development process. This framework aims to take the headaches out of layout design and alignment, offering a range of utility classes and mixins for rapid, responsive development.

## 🚧 Project Status: Early Development

This project is currently in its early stages. We're exploring new ideas and welcome any contributions or feedback to help shape its direction.

## Key Features

### 1. Innovative Layout System

The cornerstone of this framework is its innovative layout system, which includes:

- **Dynamic Layout Classes**: Create complex layouts with simple, intuitive class names
- **Breakpoint-Specific Layouts**: Easily adjust layouts for different screen sizes
- **Automatic Element Placement**: Elements are positioned based on the layout class, reducing the need for manual positioning

Example usage:
```html
<div class="layout-123-145">
  <div>Element 1</div>
  <div>Element 2</div>
  <div>Element 3</div>
  <div>Element 4</div>
  <div>Element 5</div>
</div>
```
The layout-123-145 class creates a grid with a two-row spanning first element and four elements in a 2x2 grid beside it, thus:
```html
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
| 1 | 4 | 5 |
+---+---+---+
```

### 2. Responsive Design Tools

- **Auto Grid**: Easily create responsive grid layouts with `.auto-grid`
- **Auto Flex**: Flexible layouts with `.auto-flex`
- **Responsive Classes**: Breakpoint-specific classes for fine-tuned control

### 3. Alignment Utilities

Simplify element alignment with our comprehensive alignment classes:

- `.align-*` classes for various alignment options
- Responsive alignment classes (e.g., `.align-md-centre`)

### 4. Typography

- Responsive font size classes (e.g., `.fs-1`, `.fs-md-2`)
- Text alignment utilities (e.g., `.text-centre`, `.text-md-left`)

### 5. Colour System

Easily apply colours to text and backgrounds:

- `.{colour-name}` for text colour
- `.bg-{colour-name}` for background colour

### 6. Responsive Visibility

Control element visibility across breakpoints:

- `.d-{breakpoint}-on` to show elements at specific breakpoints
- `.d-{breakpoint}-off` to hide elements at specific breakpoints

## Getting Started

As this project is in development, the setup process may change. Currently:

1. Link to the CSS file within your HTML:

   ```html
   <link rel="stylesheet" href="path/to/core.css">
   ```

2. Customise the framework by modifying the variables in `_var.scss`

3. Add your custom styles in `_custom.scss`

## Customisation

This framework is designed to be easily customisable. Key areas for customisation include:

- Breakpoints (`$breakpoints`)
- Colours (`$colors`)
- Font sizes (`$font-sizes`)
- Container width (`$container-width`)
- Grid columns (`$grid-columns`)

## Potential Benefits

- **Intuitive Layout Creation**: Utilise the innovative layout system to quickly create complex, responsive layouts
- **Rapid Development**: Use pre-built classes to quickly prototype and build layouts
- **Responsive Design**: Built-in responsiveness for seamless multi-device support
- **Customisable**: Easily adapt the framework to your project's specific needs
- **Lightweight**: Only include what you need, keeping your stylesheets lean

## Contributing

As this project is in its early stages, we greatly appreciate any contributions or feedback. If you have ideas on how to improve the framework or want to contribute code, please feel free to open an issue or submit a pull request.

## License

This project is free and open for anyone to use, modify, or distribute.

Feel free to use it, fork it, and adapt it for your needs.

If you find it helpful, a mention of the original author (Steve Allday) is appreciated but not required.

No warranties or conditions are provided. Use at your own discretion.

**Note**: This framework is an experimental concept and is actively evolving. Features and APIs may change significantly as development progresses.
