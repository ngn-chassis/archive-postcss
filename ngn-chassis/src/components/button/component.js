const ChassisComponent = require('../../component.js')

class ChassisButtonComponent extends ChassisComponent {
  constructor (chassis, customSpec) {
    super(chassis, customSpec)
    this.chassis = chassis
    
    this.name = 'button'
    this.selectors = ['button']
    this.resetType = 'inline-block'
  }

  get variables () {
    let { settings, typography, utils } = this.chassis
    let { fontSize, lineHeight } = settings.typography.ranges.first.typography.root

    let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
    let inlineHeight = typography.calculateInlineHeight(lineHeightMultiplier)
		let padding = (inlineHeight - lineHeightMultiplier) / 2

    return {
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
