const ChassisUtils = require('../utilities')

class ChassisTypography {
  constructor (viewport, settings) {
    this.project = {viewport}

    Object.keys(settings).forEach(key => {
      this[key] = settings[key]
    })

    // Standard font-sizes at different viewport widths
    // [alias]: [fontSize] in px
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

  getCalculatedFontSizeProperty (rule, line, alias) {
    alias = NGN.coalesce(alias, 'root')

    return this.project.viewport.widthRanges.map((range, index) => {
      let type = 'at'
      let fontSize = this.getFontSize(alias, range.upperBound)

      let css = [ChassisUtils.newRule(rule.parent.selector, [
        ChassisUtils.newDeclObj('font-size', `${fontSize}px`)
      ])]

      if (index === 1) {
        type = 'max'
      } else if (index === this.project.viewport.widthRanges.length) {
        type = 'min'
      }

      return this.project.viewport.getMediaQuery(type, range.name, css)
    })
  }

  getCalculatedLineHeightProperty (rule, line, alias) {
    alias = NGN.coalesce(alias, 'root')

    return this.project.viewport.widthRanges.map((range, index) => {
      let type = 'at'
      let lineHeight = this.getLineHeight(alias, range.upperBound)

      let css = [ChassisUtils.newRule(rule.parent.selector, [
        ChassisUtils.newDeclObj('line-height', `${lineHeight}px`)
      ])]

      if (index === 1) {
        type = 'max'
      } else if (index === this.project.viewport.widthRanges.length) {
        type = 'min'
      }

      return this.project.viewport.getMediaQuery(type, range.name, css)
    })
  }

  getCalculatedProperties (rule, line, config) {
    let alias = NGN.coalesce(config.alias, 'root')

    let multiplier = NGN.coalesce(config.multiplier, 1)
    let addMargin = NGN.coalesce(config.addMargin, false)

    return this.project.viewport.widthRanges.map((range, index) => {
      let type = 'at'
      let fontSize = this.getFontSize(alias, range.upperBound) * multiplier
      let lineHeight = this.getLineHeight(alias, range.upperBound) * multiplier

      let css = [ChassisUtils.newRule(rule.parent.selector, [
        ChassisUtils.newDeclObj('font-size', `${fontSize}px`),
        ChassisUtils.newDeclObj('line-height', `${lineHeight}px`)
      ])]

      if (addMargin) {
        css[0].append(ChassisUtils.newDecl('margin-bottom', `${lineHeight / fontSize}em`))
      }

      if (index === 1) {
        type = 'max'
      } else if (index === this.project.viewport.widthRanges.length) {
        type = 'min'
      }

      return this.project.viewport.getMediaQuery(type, range.name, css)
    })
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

    if (inEms) {
      return (definition.fontSizes[alias] * this.globalMultiplier) / definition.fontSizes.root
    }

    return definition.fontSizes[alias] * this.globalMultiplier
  }

  /**
   * @method getFormLegendProperties
   * Get GR-Typography default settings for legend tags
   * @param {object} range
   * Viewport Width Range
   * @return {rule}
   */
  getFormLegendProperties (range) {
    let fontSize = `${this.getFontSize(this.fontSizes.formLegend, range.upperBound, true)}em`
    let lineHeight = `${this.getLineHeight(this.fontSizes.formLegend, range.upperBound, true)}em`
    let marginBottom = `${this.getMargin(this.fontSizes.formLegend, range.upperBound, 'heading')}em`

    return ChassisUtils.newRule('.chassis legend', [
      ChassisUtils.newDeclObj('font-size', fontSize),
      ChassisUtils.newDeclObj('line-height', lineHeight),
      ChassisUtils.newDeclObj('margin-bottom', marginBottom)
    ])
  }

  /**
   * @method getHeadingProperties
   * Get GR-Typography default settings for heading tags
   * @param {string} level
   * 1-6
   * @param {object} range
   * Viewport Width Range
   * @return {rule}
   */
  getHeadingProperties (level, range) {
    let fontSize = `${this.getFontSize(this.fontSizes.headings[level], range.upperBound, true)}em`
    let lineHeight = `${this.getLineHeight(this.fontSizes.headings[level], range.upperBound, true)}em`
    let marginBottom = `${this.getMargin(this.fontSizes.headings[level], range.upperBound, 'heading')}em`

    return ChassisUtils.newRule(`.chassis h${level}`, [
      ChassisUtils.newDeclObj('font-size', fontSize),
      ChassisUtils.newDeclObj('line-height', lineHeight),
      ChassisUtils.newDeclObj('margin-bottom', marginBottom)
    ])
  }

  /**
   * @method getLineHeight
   * Get GR-Typography calculated line-height by type at the specified viewport
   * width
   * @param {string} fontSizeAlias
   * GR-Typography font-size alias: root, small, large, larger, largest
   * @param {number} upperBound
   * Upper bound of current viewport width range
   * @return {number}
   */
  getLineHeight (fontSizeAlias, upperBound, inEms = false) {
    let fontSize = this.getFontSize(fontSizeAlias, upperBound)

    if (inEms) {
      return this.getOptimalLineHeight(fontSize, upperBound) / fontSize
    }

    return this.getOptimalLineHeight(fontSize, upperBound)
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
    let optimalLineWidth = this.getOptimalLineWidth(fontSize)

    return Math.round((this.typeScaleRatio - ((1 / (2 * this.typeScaleRatio)) * (1 - (upperBound / optimalLineWidth)))) * fontSize)
  }

  /**
   * @method getOptimalLineWidth
   * Calculate optimal line width for the given font size
   * @param {number} fontSize in pixels
   * @param {number} ratio
   * Type scale ratio
   * @return {number}
   */
  getOptimalLineWidth (fontSize, ratio = this.typeScaleRatio) {
    let lineHeight = fontSize * ratio

    return Math.pow(lineHeight, 2)
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
  getMargin (fontSizeAlias, upperBound, type) {
    switch (type) {
      case 'heading':
        return (this.getLineHeight(fontSizeAlias, upperBound) / this.typeScaleRatio) / this.getFontSize(fontSizeAlias, upperBound)
        break

      default:
        return 1
    }
  }

  /**
   * @method getParagraphStyles
   * Get default styles for p tags
   */
  getParagraphStyles (range) {
    return ChassisUtils.newRule('.chassis p', [
      ChassisUtils.newDeclObj('margin-bottom', '1em')
    ])
  }
}

module.exports = ChassisTypography
