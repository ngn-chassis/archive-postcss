const ChassisUtils = require('../utilities')

class ChassisLayout {
  constructor (viewport, typography, settings) {
    this.viewport = viewport
    this.typography = typography
    this.settings = settings
  }

  /**
   * @getter gutter
   * Project side-gutter width
   * @return {string}
   */
  get gutter () {
    if (!this.settings.gutter) {
      console.warn('[WARNING] Chassis Layout: Gutter Value has not been set!')
      return ''
    }

    return this.settings.gutter
  }

  /**
   * @getter gutter
   * Project min-width
   * @return {string}
   */
  get minWidth () {
    if (!this.settings.minWidth) {
      console.warn('[WARNING] Chassis Layout: Minimum Width Value has not been set!')
      return ''
    }

    return this.settings.minWidth
  }

  /**
   * @getter gutter
   * Project max-width
   * @return {string}
   */
  get maxWidth () {
    if (!this.settings.maxWidth) {
      console.warn('[WARNING] Chassis Layout: Maximum Width Value has not been set!')
      return ''
    }

    return this.settings.maxWidth
  }

  /**
   * @method getMargin
   * Get calculated GR-Typography margin-bottom value
   * @param {string} type
   * "container" or "block"; containers are top-level elements, blocks are
   * children
   * @param fontSize
   * Current font size to use as a base for calculation
   * * @param upperBound
   * Upper bound of current viewport width range
   */
  getMargin (type, fontSize, upperBound) {
    switch (type) {
      case 'container':
        return Math.round(this.typography.getLineHeight(fontSize, upperBound) * this.typography.typeScaleRatio)
        break

      case 'block':
        return this.typography.getLineHeight(fontSize, upperBound)
        break

      default:
        return '1em'
    }
  }

  /**
   * @method getMargin
   * Get calculated GR-Typography padding value (left or right)
   * @param {string} type
   * --
   * @param fontSize
   * Current font size to use as a base for calculation
   * * @param upperBound
   * Upper bound of current viewport width range
   */
  getPadding (type, fontSize, upperBound) {
    console.log('TODO: Finish padding getter!');
  }

  /**
   * @method getGutterLimit
   * Get a pixel-value for gutter width at min or max viewport width ranges
   * This prevents gutters from shrinking or enlarging when the window has
   * shrunk below the minimum or grown larger than the maximum layout width
   * @param {number} width
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
        return `${parseFloat(this.gutter) * (this.typography.baseFontSize * this.typography.globalMultiplier)}px`
        break

      default:
        console.error(`"${unit}" units cannot be used for Layout Gutter. Please use vw, %, px or rem instead.`)
    }
  }

  /**
   * @method getContainerStyles
   * Get default decls for Container elements
   * @param {string} range
   * Current viewport width range
   * @return {rule}
   */
  getDefaultContainerStyles (range) {
    return ChassisUtils.newRule('.chassis section, .chassis nav, .chassis form', [
      ChassisUtils.newDeclObj('margin-bottom', `${this.getMargin('container', 'root', range.upperBound)}px`)
    ])
  }

  /**
   * @method getBlockElementStyles
   * Get default decls for Block elements
   * @param {string} range
   * Current viewport width range
   * @return {rule}
   */
  getDefaultBlockElementStyles (range) {
    return ChassisUtils.newRule('.chassis nav section, .chassis section nav, .chassis nav nav, .chassis article, .chassis fieldset, .chassis figure, .chassis pre, .chassis blockquote, .chassis table, .chassis canvas, .chassis embed', [
      ChassisUtils.newDeclObj('margin-bottom', `${this.getMargin('block', 'root', range.upperBound)}px`)
    ])
  }

  getBlockElementStyles (rule, line, config) {
    let stripMargin = NGN.coalesce(config.stripMargin, false)
    let stripPadding = NGN.coalesce(config.stripPadding, false)
    let stripVerticalPadding = NGN.coalesce(config.stripVerticalPadding, false)
    let stripHorizontalPadding = NGN.coalesce(config.stripHorizontalPadding, false)

    let css = []

    this.viewport.widthRanges.forEach((range, index) => {
      let fontSize = this.typography.getFontSize('root', range.upperBound)
      let lineHeight = this.typography.getLineHeight('root', range.upperBound) / fontSize

      if (index === 1) {
        if (!stripMargin) {
          css.push(ChassisUtils.newDecl('margin', `0 0 ${lineHeight}em 0`))
        }

        if (!stripPadding) {
          let padding = [(lineHeight / this.typography.typeScaleRatio) / 2, 1]

          if (stripVerticalPadding) {
            padding[0] = 0
          }

          if (stripHorizontalPadding) {
            padding[1] = 0
          }

          css.push(ChassisUtils.newDecl(
            'padding',
            padding.map(value => value === 0 ? 0 : `${value}em`).join(' '))
          )
        }
      } else {
        // TODO: Add Media Queries
      }
    })

    console.log(css);
    return css
  }
}

module.exports = ChassisLayout
