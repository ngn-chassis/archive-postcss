const util = require('../utilities')

class ChassisTypography {
  constructor (viewport, settings) {
    this.viewport = viewport
    this.baseFontSize = settings.baseFontSize
    this.typeScaleRatio = settings.typeScaleRatio
    this.globalMultiplier = settings.globalMultiplier
    this.fontWeights = settings.fontWeights
    this.fontSizes = settings.fontSizes

    // Standard font-sizes at different viewport widths
    this.definitions = [
      {
        lowerBound: 0,
        upperBound: 320,
        fontSizes: {
          root: 14,
          small: 11,
          large: 18,
          larger: 23,
          largest: 37
        }
      },
      {
        lowerBound: 320,
        upperBound: 512,
        fontSizes: {
          root: 15,
          small: 12,
          large: 19,
          larger: 24,
          largest: 39
        }
      },
      {
        lowerBound: 512,
        upperBound: 768,
        fontSizes: {
          root: 16,
          small: 13,
          large: 20,
          larger: 26,
          largest: 42
        }
      },
      {
        lowerBound: 768,
        upperBound: 1024,
        fontSizes: {
          root: 17,
          small: 13,
          large: 22,
          larger: 28,
          largest: 45
        }
      },
      {
        lowerBound: 1024,
        upperBound: 1200,
        fontSizes: {
          root: 18,
          small: 14,
          large: 23,
          larger: 29,
          largest: 47
        }
      },
      {
        lowerBound: 1200,
        upperBound: 1440,
        fontSizes: {
          root: 19,
          small: 15,
          large: 24,
          larger: 31,
          largest: 50
        }
      },
      {
        lowerBound: 1440,
        upperBound: 1600,
        fontSizes: {
          root: 20,
          small: 16,
          large: 25,
          larger: 32,
          largest: 52
        }
      },
      {
        lowerBound: 1600,
        upperBound: 1920,
        fontSizes: {
          root: 21,
          small: 17,
          large: 27,
          larger: 34,
          largest: 55
        }
      },
      {
        lowerBound: 1920,
        upperBound: 2048,
        fontSizes: {
          root: 22,
          small: 17,
          large: 28,
          larger: 36,
          largest: 58
        }
      }
    ]
  }

  /**
   * @method getFontSize
   * Get GR-Typography font size by type at the specified viewport width
   * @param {string} type
   * GR-Typography font-size: root, small, large, larger, largest
   * @param {number} upperBound
   * Upper bound of current viewport width range
   * @return {number}
   */
  getFontSize (type, upperBound) {
    let definition = [...this.definitions].filter(def => {
      return upperBound >= def.upperBound
    }).pop()


    if (!definition) {
      console.error(`[ERROR] Chassis Typography: Font Size "${type}" not found`)
    }

    return definition.fontSizes[type] * this.globalMultiplier
  }

  /**
   * @method getLineHeight
   * Get GR-Typography calculated line-height by type at the specified viewport
   * width
   * @param {string} type
   * GR-Typography font-size: root, small, large, larger, largest
   * @param {number} upperBound
   * Upper bound of current viewport width range
   * @return {number}
   */
  getLineHeight (type, upperBound) {
    let fontSize = this.getFontSize(type, upperBound)

    return this.getOptimalLineHeight(fontSize, upperBound)
  }

  /**
   * @method getOptimalLineWidth
   * Calculate optimal line width for the given font size
   * @param {number} fontSize in pixels
   * @param {number} ratio
   * Type scale ratio
   * @return {number}
   */
  getOptimalLineWidth (fontSize, ratio) {
    let lineHeight = Math.round(fontSize * ratio)

    return Math.pow(lineHeight, 2)
  }

  /**
   * @method getOptimalLineHeight
   * Calculate optimal line height for the given font size
   * @param {number} fontSize in pixels
   * @param {number} upperBound
   * Upper bound of the current viewport width range
   * @return {number}
   */
  getOptimalLineHeight (fontSize, upperBound) {
    let optimalLineWidth = this.getOptimalLineWidth(fontSize, this.typeScaleRatio)

    return Math.round((this.typeScaleRatio - ((1 / (2 * this.typeScaleRatio)) * (1 - (upperBound / optimalLineWidth)))) * fontSize)
  }

  /**
   * @method getParagraphStyles
   * Get default styles for p tags
   */
  getParagraphStyles (range) {
    return util.newRule('.chassis p', [
      util.newDeclObj('margin-bottom', '1em')
    ])
  }

  /**
   * @method getMargin
   * Get calculated GR-Typography margin-bottom values for typography elements
   * @param {string} fontSize
   * GR-Typography font-size type
   * @param {number} upperBound
   * Upper bound of current viewport width range
   * @param {string} type
   * Options: 'heading'
   * Headings have slightly larger margins than other elements such as p tags
   */
  getMargin (fontSize, upperBound, type) {
    switch (type) {
      case 'heading':
        return Math.round(this.getLineHeight(fontSize, upperBound) / this.typeScaleRatio)
        break

      default:
        return '1em'
    }
  }

  /**
   * @method getFormLegendStyles
   * Get GR-Typography default settings for legend tags
   * @param {object} range
   * Viewport Width Range
   * @return {rule}
   */
  getFormLegendStyles (range) {
    return util.newRule('.chassis legend', [
      util.newDeclObj('font-size', `${this.getFontSize(this.fontSizes.formLegend, range.upperBound)}px`),
      util.newDeclObj('line-height', `${this.getLineHeight(this.fontSizes.formLegend, range.upperBound)}px`),
      util.newDeclObj('margin-bottom', `${this.getMargin(this.fontSizes.formLegend, range.upperBound, 'heading')}px`)
    ])
  }

  /**
   * @method getHeadingStyles
   * Get GR-Typography default settings for heading tags
   * @param {string} level
   * 1-6
   * @param {object} range
   * Viewport Width Range
   * @return {rule}
   */
  getHeadingStyles (level, range) {
    return util.newRule(`.chassis h${level}`, [
      util.newDeclObj('font-size', `${this.getFontSize(this.fontSizes.headings[level], range.upperBound)}px`),
      util.newDeclObj('line-height', `${this.getLineHeight(this.fontSizes.headings[level], range.upperBound)}px`),
      util.newDeclObj('margin-bottom', `${this.getMargin(this.fontSizes.headings[level], range.upperBound, 'heading')}px`)
    ])
  }
}

module.exports = ChassisTypography
