"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassDetector = void 0;
class ClassDetector {
    constructor() {
        // Single comprehensive regex for ALL Core4 classes
        this.classPattern = new RegExp([
            // Layout classes (including responsive)
            'layout-(?:[a-z]{2}-)?[a-zA-Z0-9\\-]+',
            // Spacing classes
            '[mp][xy]?-[a-zA-Z0-9]+',
            // Typography classes
            'fs-[a-zA-Z0-9]+',
            'fw-[a-zA-Z0-9]+',
            'text-(?:xs|sm|base|lg|xl|2xl|3xl|center|left|right)',
            // Color classes
            '(?:bg-)?(?:primary|secondary|highlight|danger|success|warning|info|black|white|grey-lightest|grey-darkest|trans-grey|trans-black|dark-violet|light-violet)',
            // Display and positioning
            '(?:show|hide)(?:-(?:sm|mm|lm|st|mt|lt|sd|md|ld))?',
            'relative|absolute|fixed',
            'left|center|right',
            // Visual effects
            'radius|shadow|border(?:-[2trlb])?|rounded(?:-(?:sm|lg|full))?',
            // Layout utilities
            'max-lines-[0-9]+',
            'gap(?:-[a-zA-Z0-9]+)?',
            'align-[a-z]{2}',
            // New utility classes
            'w-(?:full|1/2|1/3|2/3|1/4|3/4|screen)',
            'h-(?:screen|full|auto|\\d+)',
            'space-[xy]-[1-8]',
            'overflow-(?:hidden|auto|scroll|visible)',
            '(?:uppercase|lowercase|capitalize)',
            // Flexbox classes
            'flex(?:-(?:col|row|wrap|nowrap))?',
            '(?:items|justify)-(?:start|center|end|between|around|evenly|stretch)',
            // Container and other utilities
            'container(?:-(?:sm|lg))?',
            'full-width|col-gap|row-gap',
            'float-(?:left|right)',
            'box-shadow|list-style-(?:none|inline)'
        ].join('|'), 'g');
    }
    detectClasses(content) {
        const matches = content.match(this.classPattern);
        return new Set(matches || []);
    }
}
exports.ClassDetector = ClassDetector;
//# sourceMappingURL=classDetector.js.map