# Core4 Quick Reference

## Layout
- `layout-123-456` - Children 1,2,3 in first row; 4,5,6 in second row
- `layout-123-124` - Children 1,2,3 in first row; 1,2,4 in second row (1 and 2 span both rows)
- `auto-flex` - Auto-flex container
- `auto-grid` - Auto-grid container
- `equal` - Equal width items
- `items` - Grid of items
- `list` - List of things

## Spacing
- `m-1` - margin: 0.6em
- `m-sm-2` - margin: 1.2em (small screens)
- `mx-3` - margin-left/right: 1.8em
- `my-4` - margin-top/bottom: 2.4em
- `ml-2`, `mr-2`, `mt-2`, `mb-2` - margin directions
- `p-1` - padding: 0.6em
- `p-sm-2` - padding: 1.2em (small screens)
- `px-3`, `py-4` - padding x/y
- `pl-2`, `pr-2`, `pt-2`, `pb-2` - padding directions

## Typography
- `fs-10xl` to `fs-3xs` - Font sizes (105px to 10px)
- `fs-md` - 16px (default)
- `fs-sm` - 14px
- `fs-lg` - 18px
- `left` - text-align: left
- `center` - text-align: center
- `right` - text-align: right

## Positioning
- `relative` - position: relative
- `absolute` - position: absolute
- `fixed` - position: fixed

## Display
- `hidden` - display: none
- `block` - display: block
- `show-sm` - display: initial (small screens)
- `hide-md` - display: none (medium screens)
- `block-lg` - display: block (large screens)

## Visual Effects
- `radius` - border-radius: 0.35em
- `radius-sm` - border-radius: 4px
- `radius-lg` - border-radius: 0.7em
- `radius-xl` - border-radius: 40px

## Colors
- `primary` - #008001
- `secondary` - #005500
- `highlight` - #FFB613
- `danger` - #B71234
- `black` - #0e0e0e
- `white` - #fff

## Interactive Elements
- `slider` - Carousel/slider
- `expand` - Expandable content
- `popup` - Popup/overlay

## Breakpoints
- `sm`: 320px
- `mm`: 386px
- `lm`: 466px
- `st`: 562px
- `mt`: 678px
- `lt`: 818px
- `sd`: 987px
- `md`: 1191px
- `ld`: 1500px

## Responsive Pattern
- `{class}-{breakpoint}-{value}`
- Example: `m-sm-2`, `fs-md-3xl`, `hide-lg` 