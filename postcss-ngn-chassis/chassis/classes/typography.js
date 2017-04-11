const ChassisUtils = require('../utilities')
const ChassisConstants = require('../constants')

class ChassisTypography {
  constructor (viewport, settings) {
    this.project = {viewport}

    for (let key in settings) {
      this[key] = settings[key]
    }

    this.definitions = ChassisConstants.goldenRatioTypographyRules
  }

  /**
   * @method getFontSize
   * Get GR-Typography font size by type at the specified viewport width
   * @param {string} alias
   * GR-Typography font-size alias: root, small, large, larger, largest
   * @param {number} upperBound
   * Upper bound of current viewport width range
   * @return {number}
   */
  getFontSize (alias, upperBound, inEms = false) {
    let definition = this.definitions.filter(def => {
      return upperBound >= def.upperBound
    }).pop()

    if (!definition) {
      console.error(`[ERROR] Chassis Typography: Font Size "${type}" not found`)
    }

    let fontSize = definition.fontSizes[alias] * this.globalMultiplier

    return inEms ? fontSize / definition.fontSizes.root : fontSize
  }

  /**
   * @method getFontWeight
   * Get GR-Typography font size by type at the specified viewport width
   * @param {string} alias
   * Font weight alias: thin, light, regular, semibold, bold, ultra
   * @return {number}
   */
  getFontWeight (line, alias) {
    // TODO: Add error handling
    return this.fontWeights[alias]
  }

  /**
   * @method getLineHeight
   * Get GR-Typography calculated line-height by type at the specified viewport
   * width
   * @param {string} fontSizeAlias
   * GR-Typography font-size alias: root, small, large, larger, largest
   * @param {number} upperBound
   * Upper bound of current viewport width range
   * @return {number} of ems
   */
  getLineHeight (fontSizeAlias, upperBound) {
    let fontSize = this.getFontSize(fontSizeAlias, upperBound)
    let optimalLineHeight = this._getOptimalLineHeight(fontSize, upperBound)

    return optimalLineHeight / fontSize
  }

  /**
   * @method getMargin
   * Get calculated GR-Typography margin-bottom values for typography elements
   * @param {string} fontSizeAlias
   * GR-Typography font-size alias
   * @param {number} upperBound
   * Upper bound of current viewport width range
   * @param {string} type
   * Options: 'heading'
   * Headings have slightly larger margins than other elements such as p tags
   * @return {number} in ems
   */
  getMargin (fontSizeAlias, upperBound) {
    let lineHeight = this.getLineHeight(fontSizeAlias, upperBound)
    let fontSize = this.getFontSize(fontSizeAlias, upperBound)

    return (lineHeight / this.typeScaleRatio)
  }

  /**
   * @method _getOptimalLineHeight
   * Calculate optimal line height for the given font size
   * @param {number} fontSize in pixels
   * @param {number} upperBound
   * Upper bound of the current viewport width range
   * @return {number}
   * @private
   */
  _getOptimalLineHeight (fontSize, upperBound) {
    let optimalLineWidth = this._getOptimalLineWidth(fontSize)

    return Math.round((this.typeScaleRatio - ((1 / (2 * this.typeScaleRatio)) * (1 - (upperBound / optimalLineWidth)))) * fontSize)
  }

  /**
   * @method _getOptimalLineWidth
   * Calculate optimal line width for the given font size
   * @param {number} fontSize in pixels
   * @param {number} ratio
   * Type scale ratio
   * @return {number}
   * @private
   */
  _getOptimalLineWidth (fontSize, ratio = this.typeScaleRatio) {
    let lineHeight = fontSize * ratio

    return Math.pow(lineHeight, 2)
  }
}

module.exports = ChassisTypography
