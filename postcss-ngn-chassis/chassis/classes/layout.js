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

  getBlockElementProperties (config) {
    let alias = NGN.coalesce(config.alias, 'root')
    let stripMargin = NGN.coalesce(config.stripMargin, false)
    let stripPadding = NGN.coalesce(config.stripPadding, false)
    let stripVerticalPadding = NGN.coalesce(config.stripVerticalPadding, false)
    let stripHorizontalPadding = NGN.coalesce(config.stripHorizontalPadding, false)

    let css = []

    this.project.viewport.widthRanges.forEach((range, index) => {
      let fontSize = this.project.typography.getFontSize(alias, range.upperBound, true)
      let lineHeight = this.project.typography.getLineHeight(alias, range.upperBound)

      if (index === 1) {
        if (!stripMargin) {
          css.push(ChassisUtils.newDecl('margin', `0 0 ${lineHeight}em 0`))
        }

        if (!stripPadding) {
          let padding = [(lineHeight / this.project.typography.typeScaleRatio) / 2, 1]

          if (stripVerticalPadding) {
            padding[0] = 0
          }

          if (stripHorizontalPadding) {
            padding[1] = 0
          }

          css.push(ChassisUtils.newDecl(
            'padding',
            this._listPropertyValues(padding)
          ))
        }
      } else {
        // TODO: Add Media Queries
      }
    })

    console.log(css);
    return css
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

  getInlineElementProperties (rule, line, config) {
    let alias = NGN.coalesce(config.alias, 'root')
    let stripPadding = NGN.coalesce(config.stripPadding, false)
    let stripMargin = NGN.coalesce(config.stripMargin, false)
    let stripVerticalMargin = NGN.coalesce(config.stripVerticalMargin, false)
    let stripHorizontalMargin = NGN.coalesce(config.stripHorizontalMargin, false)

    let multiLine = NGN.coalesce(config.multiLine, false)
    let setHeight = NGN.coalesce(config.setHeight, false)

    let css = []

    this.project.viewport.widthRanges.forEach((range, index) => {
      let fontSize = this.project.typography.getFontSize(alias, range.upperBound, true)
      let baseLineHeight = this.project.typography.getLineHeight(alias, range.upperBound)

      if (index === 1) {
        if (setHeight) {
          if (multiLine) {
            css.push(ChassisUtils.newDecl(
              'height',
              `${baseLineHeight}em`
            ))
          } else {
            css.push(ChassisUtils.newDecl(
              'height',
              `${baseLineHeight * this.project.typography.typeScaleRatio}em`
            ))
          }
        }

        if (!stripPadding) {
          let padding = [0, baseLineHeight / 2]

          if (multiLine) {
            padding[0] = ((baseLineHeight * this.project.typography.typeScaleRatio) - baseLineHeight) / 2
          }

          css.push(ChassisUtils.newDecl(
            'padding',
            this._listPropertyValues(padding)
          ))
        }

        if (!stripMargin) {
          let margin = [0, baseLineHeight / 2, baseLineHeight, 0]

          if (stripVerticalMargin) {
            margin[2] = 0
          }

          if (stripHorizontalMargin) {
            margin[1] = 0
          }

          css.push(ChassisUtils.newDecl(
            'margin',
            this._listPropertyValues(margin)
          ))
        }

        if (multiLine) {
          css.push(ChassisUtils.newDecl(
            'line-height',
            `${baseLineHeight}em`
          ))
        } else {
          css.push(ChassisUtils.newDecl(
            'line-height',
            `${baseLineHeight * this.project.typography.typeScaleRatio}em`
          ))
        }
      } else {
        // TODO: Add media queries
      }
    })

    console.log(css);
    return css
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

  _listPropertyValues (array) {
    return array.map(value => value === 0 ? 0 : `${value}em`).join(' ')
  }
}

module.exports = ChassisLayout
