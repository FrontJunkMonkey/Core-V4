export class ClassDetector {
  private layoutPattern = /layout-([a-zA-Z0-9\-]+)/g;
  private spacingPattern = /(m|p)(x|y)?-([a-zA-Z0-9]+)/g;
  private fontSizePattern = /fs-([a-zA-Z0-9]+)/g;
  private fontWeightPattern = /fw-([a-zA-Z0-9]+)/g;
  private colorPattern = /(primary|secondary|highlight|danger|black|white|grey-lightest|grey-darkest|trans-grey|trans-black|dark-violet|light-violet)/g;
  private bgColorPattern = /bg-(primary|secondary|highlight|danger|black|white|grey-lightest|grey-darkest|trans-grey|trans-black|dark-violet|light-violet)/g;
  private displayPattern = /(show|hide)(-sm|-mm|-lm|-st|-mt|-lt|-sd|-md|-ld)?/g;
  private displayDefaultPattern = /\b(show|hide)\b/g;
  private positioningPattern = /(relative|absolute|fixed)/g;
  private textAlignPattern = /(left|center|right)/g;
  private visualPattern = /(radius|shadow)/g;
  private maxLinesPattern = /max-lines-([0-9]+)/g;
  private gapPattern = /gap(-[a-zA-Z0-9]+)?/g;
  private gapDefaultPattern = /\bgap\b/g;
  private alignmentPattern = /align-(tl|tc|tr|ml|mc|mr|bl|bc|br)/g;
  private utilityPattern = /(container|container-sm|container-lg|full-width|col-gap|row-gap|float-left|float-right|overflow-hidden|box-shadow|list-style-none|list-style-inline)/g;

  detectClasses(content: string): Set<string> {
    const classes = new Set<string>();

    // Layout classes
    let match;
    while ((match = this.layoutPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Spacing classes (margin/padding)
    this.spacingPattern.lastIndex = 0;
    while ((match = this.spacingPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Font size classes
    this.fontSizePattern.lastIndex = 0;
    while ((match = this.fontSizePattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Font weight classes
    this.fontWeightPattern.lastIndex = 0;
    while ((match = this.fontWeightPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Color classes
    this.colorPattern.lastIndex = 0;
    while ((match = this.colorPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Background color classes
    this.bgColorPattern.lastIndex = 0;
    while ((match = this.bgColorPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Display classes (with breakpoints)
    this.displayPattern.lastIndex = 0;
    while ((match = this.displayPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Default display classes (show/hide without breakpoints)
    this.displayDefaultPattern.lastIndex = 0;
    while ((match = this.displayDefaultPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Positioning classes
    this.positioningPattern.lastIndex = 0;
    while ((match = this.positioningPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Text alignment classes
    this.textAlignPattern.lastIndex = 0;
    while ((match = this.textAlignPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Visual effect classes
    this.visualPattern.lastIndex = 0;
    while ((match = this.visualPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Max lines classes
    this.maxLinesPattern.lastIndex = 0;
    while ((match = this.maxLinesPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Gap classes (with sizes)
    this.gapPattern.lastIndex = 0;
    while ((match = this.gapPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Default gap class
    this.gapDefaultPattern.lastIndex = 0;
    while ((match = this.gapDefaultPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Alignment classes
    this.alignmentPattern.lastIndex = 0;
    while ((match = this.alignmentPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    // Utility classes
    this.utilityPattern.lastIndex = 0;
    while ((match = this.utilityPattern.exec(content)) !== null) {
      classes.add(match[0]);
    }

    return classes;
  }
} 