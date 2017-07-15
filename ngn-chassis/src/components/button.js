const ChassisComponent = require('../component.js')

class ChassisButtonComponent extends ChassisComponent {
  constructor (chassis, theme) {
    super(chassis)
    this.chassis = chassis

    this.name = 'button'
    this.theme = theme
    this.stylesheet = '../component-sheets/button.spec.css'
    this.selectors = ['button']

    this.states = [
      'default',
  		'visited',
  		'hover',
  		'active',
  		'disabled',
  		'focus'
    ]

    this.children = [
      'icon',
    ]

    this.variants = [
      'pill',
  		'multi-line'
    ]

    this.extensions = NGN.coalesce(chassis.extensions.button, null)
    this.resetType = 'inline-block'
  }

  get variables () {
    let { settings, typography, utils } = this.chassis
    let { fontSize, lineHeight } = settings.typography.ranges.first.typography.root

    let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
    let inlineHeight = typography.calculateInlineHeight(lineHeightMultiplier)
		let padding = (inlineHeight - lineHeightMultiplier) / 2

    return {
      'margin-right': `${typography.calculateInlineMarginX(lineHeightMultiplier)}em`,
      'margin-bottom': `${typography.calculateInlineMarginY(lineHeightMultiplier)}em`,
      'padding-x': `${typography.calculateInlinePaddingX(lineHeightMultiplier)}em`,
      'line-height': typography.calculateInlineHeight(lineHeightMultiplier),
      'icon-offset': `translateX(-${(typography.calculateInlinePaddingX(lineHeightMultiplier) / 2) - utils.units.toEms(fontSize / (settings.typography.scaleRatio * 10), fontSize)}em)`,
      'pill-padding-x': `${settings.typography.scaleRatio}em`,
      'pill-border-radius': `${lineHeightMultiplier}em`,
      'multi-line-padding-y': `${padding}em`,
			'multi-line-line-height': `${lineHeightMultiplier}`,
			'multi-line-white-space': 'normal'
    }
  }
}

module.exports = ChassisButtonComponent
