const util = require('../utilities')

class ChassisTypography {
  constructor (viewport, settings) {
    this.viewport = viewport
    this.baseFontSize = settings.baseFontSize
    this.typeScaleRatio = settings.typeScaleRatio
    this.globalMultiplier = settings.globalMultiplier
    this.fontWeights = settings.fontWeights
    this.fontSizes = settings.fontSizes

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

  getFontSize (type, upperBound) {
    let definition = this.definitions.filter(def => {
      return upperBound >= def.upperBound
    }).pop()


    if (!definition) {
      console.error(`Chassis Typography: Font Size "${type}" not found`)
    }

    return definition.fontSizes[type] * this.globalMultiplier
  }

  getLineHeight (type, upperBound) {
    let fontSize = this.getFontSize(type, upperBound)

    return this.getOptimalLineHeight(fontSize, upperBound)
  }

  getOptimalLineWidth (fontSize, ratio) {
    let lineHeight = Math.round(fontSize * ratio)

    return Math.pow(lineHeight, 2)
  }

  getOptimalLineHeight (fontSize, upperBound) {
    let optimalLineWidth = this.getOptimalLineWidth(fontSize, this.typeScaleRatio)

    return Math.round((this.typeScaleRatio - ((1 / (2 * this.typeScaleRatio)) * (1 - (upperBound / optimalLineWidth)))) * fontSize)
  }

  getParagraphStyles (range) {
    return util.newRule('.chassis p', [
      util.newDeclObj('margin-bottom', '1em')
    ])
  }

  getMargin (fontSize, upperBound, type) {
    switch (type) {
      case 'heading':
        return Math.round(this.getLineHeight(fontSize, upperBound) / this.typeScaleRatio)
        break

      default:
        return '1em'
    }
  }

  getFormLegendStyles (range) {
    return util.newRule('.chassis legend', [
      util.newDeclObj('font-size', `${this.getFontSize(this.fontSizes.formLegend, range.upperBound)}px`),
      util.newDeclObj('line-height', `${this.getLineHeight(this.fontSizes.formLegend, range.upperBound)}px`),
      util.newDeclObj('margin-bottom', `${this.getMargin(this.fontSizes.formLegend, range.upperBound, 'heading')}px`)
    ])
  }

  getHeadingStyles (level, range) {
    return util.newRule(`.chassis h${level}`, [
      util.newDeclObj('font-size', `${this.getFontSize(this.fontSizes.headings[level], range.upperBound)}px`),
      util.newDeclObj('line-height', `${this.getLineHeight(this.fontSizes.headings[level], range.upperBound)}px`),
      util.newDeclObj('margin-bottom', `${this.getMargin(this.fontSizes.headings[level], range.upperBound, 'heading')}px`)
    ])
  }
}

module.exports = ChassisTypography
