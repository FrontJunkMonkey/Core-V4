export class ClassDetector {
  // Single comprehensive regex for ALL Core4 classes
  private classPattern = new RegExp([
    // Layout classes (including responsive and special patterns like layout-12-33)
    'layout-(?:[a-z]{2}-)?[a-zA-Z0-9\\-]+',

    // Spacing classes - including directional (ml, mr, mt, mb, pl, pr, pt, pb, px, py, mx, my) and responsive
    // Matches: m-1, mx-2, my-3, ml-4, mr-5, mt-6, mb-7, m-sm-1, mx-md-2, etc.
    'm[lrtbxy]?-(?:(?:sm|mm|lm|st|mt|lt|sd|md|ld)-)?[a-zA-Z0-9]+',
    'p[lrtbxy]?-(?:(?:sm|mm|lm|st|mt|lt|sd|md|ld)-)?[a-zA-Z0-9]+',

    // Typography classes (including responsive)
    'fs-(?:(?:sm|mm|lm|st|mt|lt|sd|md|ld)-)?[a-zA-Z0-9]+',
    'fw-[a-zA-Z0-9]+',
    'text-(?:xs|sm|base|lg|xl|2xl|3xl|center|left|right)',

    // Color classes
    '(?:bg-)?(?:primary|secondary|highlight|danger|success|warning|info|black|white|grey-lightest|grey-darkest|trans-grey|trans-black|dark-violet|light-violet)',

    // Display utilities (d-off, d-block, d-sm-off, etc.)
    'd-(?:(?:sm|mm|lm|st|mt|lt|sd|md|ld)-)?(?:off|block|inline|inline-block|flex|grid)',

    // Display and positioning (legacy show/hide)
    '(?:show|hide)(?:-(?:sm|mm|lm|st|mt|lt|sd|md|ld))?',
    'relative|absolute|fixed',
    'left|center|right',

    // Visual effects (including radius variants)
    'radius(?:-(?:sm|lg|xl))?',
    'shadow|box-shadow',
    'border(?:-[2trlb])?',
    'rounded(?:-(?:sm|lg|full))?',
    'overflow-(?:hidden|auto|scroll|visible)',
    'hover-border',

    // Layout utilities (including responsive)
    'max-lines-[0-9]+',
    'gap(?:-(?:sm|mm|lm|st|mt|lt|sd|md|ld))?(?:-[a-zA-Z0-9]+)?',
    'align-(?:(?:sm|mm|lm|st|mt|lt|sd|md|ld)-)?[a-z]{2}',

    // New utility classes
    'w-(?:full|1/2|1/3|2/3|1/4|3/4|screen)',
    'h-(?:screen|full|auto|\\d+)',
    'space-[xy]-[1-8]',
    '(?:uppercase|lowercase|capitalize)',

    // Flexbox classes
    'flex(?:-(?:col|row|wrap|nowrap))?',
    '(?:items|justify)-(?:start|center|end|between|around|evenly|stretch)',

    // Container and other utilities
    'container(?:-(?:sm|lg))?',
    'full-width|col-gap|row-gap',
    'float-(?:left|right)',
    'list-style-(?:none|inline)',

    // Interactive components
    'slider(?:-(?:dots|bar|(?:sm|mm|lm|st|mt|lt|sd|md|ld)-off))?',
    'zoomee',
    'readMore',
    'setup'
  ].join('|'), 'g');

  detectClasses(content: string): Set<string> {
    const matches = content.match(this.classPattern);
    return new Set(matches || []);
  }
}