const util = require('../utilities')

class ChassisLayout {
  constructor (viewport, typography, settings) {
    this.viewport = viewport
    this.typography = typography
    this.settings = settings
  }

  get gutter () {
    if (!this.settings.gutter) {
      console.warn('Chassis Layout: Gutter Value has not been set!')
      return ''
    }

    return this.settings.gutter
  }

  get minWidth () {
    if (!this.settings.minWidth) {
      console.warn('Chassis Layout: Minimum Width Value has not been set!')
      return ''
    }

    return this.settings.minWidth
  }

  get maxWidth () {
    if (!this.settings.maxWidth) {
      console.warn('Chassis Layout: Maximum Width Value has not been set!')
      return ''
    }

    return this.settings.maxWidth
  }

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

  getPadding (type, fontSize, upperBound) {
    console.log('TODO: Finish padding getter!');
  }

  getParsedGutter (width) {
    let unit = util.getUnit(this.gutter)

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

  getContainerStyles (range) {
    return util.newRule('.chassis section, .chassis nav, .chassis form', [
      util.newDeclObj('margin-bottom', `${this.getMargin('container', 'root', range.upperBound)}px`)
    ])
  }

  getBlockElementStyles (range) {
    return util.newRule('.chassis nav section, .chassis section nav, .chassis nav nav, .chassis article, .chassis fieldset, .chassis figure, .chassis pre, .chassis blockquote, .chassis table, .chassis canvas, .chassis embed', [
      util.newDeclObj('margin-bottom', `${this.getMargin('block', 'root', range.upperBound)}px`)
    ])
  }
}

module.exports = ChassisLayout
