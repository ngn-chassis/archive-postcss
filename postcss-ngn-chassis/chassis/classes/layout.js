const ChassisUtils = require('../utilities')

class ChassisLayout {
  constructor (viewport, typography, settings) {
    this.project = {
      viewport,
      typography
    }

    for (let key in settings) {
      this[key] = settings[key]
    }
  }

  /**
   * @method getGutterLimit
   * Get a pixel-value for gutter width at min or max viewport width ranges
   * This prevents gutters from shrinking or enlarging when the window has
   * shrunk below the minimum or grown larger than the maximum layout width
   * @param {number} width in px
   * Width of layout at current viewport size
   * Only applicable at min or max
   */
  getGutterLimit (width) {
    let unit = ChassisUtils.getUnit(this.gutter)

    switch (unit) {
      case 'vw':
        return `calc(${width}px * ${parseFloat(this.gutter)} / 100)`
        break

      case '%':
        return `calc(${width}px * ${parseFloat(this.gutter)} / 100)`
        break

      case 'px':
        return this.gutter
        break

      case 'em':
        return this.gutter
        break

      case 'rem':
        return `${parseFloat(this.gutter) * (this.project.typography.baseFontSize * this.project.typography.globalMultiplier)}px`
        break

      default:
        console.error(`"${unit}" units cannot be used for Layout Gutter. Please use vw, %, px or rem instead.`)
    }
  }

  /**
   * @method getMargin
   * Get calculated GR-Typography margin-bottom value
   * @param {string} type
   * "container" or "block"; containers are top-level elements, blocks are
   * children
   * @param {string} fontSizeAlias
   * font size alias to use as a base for calculation
   * Accepts root, small, large, larger, largest
   * @param {number} upperBound
   * Upper bound of current viewport width range
   * @return {number} in ems
   */
  getMargin (fontSizeAlias, upperBound, type) {
    switch (type) {
      case 'container':
        return this.project.typography.getLineHeight(fontSizeAlias, upperBound) * this.project.typography.typeScaleRatio
        break

      case 'block':
        return this.project.typography.getLineHeight(fontSizeAlias, upperBound)
        break

      default:
        return this.project.typography.getFontSize(fontSizeAlias, upperBound, true)
    }
  }

  /**
   * @method getPadding
   * Get calculated GR-Typography padding value (left or right)
   * @param {string} type
   * TODO: Add type description
   * @param {string} fontSize
   * Current font size type to use as a base for calculation
   * Accepts root, small, large, larger, largest
   * @param {number} upperBound
   * Upper bound of current viewport width range
   */
  getPadding (type, fontSize, upperBound) {
    console.log('TODO: Finish padding getter!');
  }
}

module.exports = ChassisLayout
