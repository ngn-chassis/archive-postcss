const ChassisComponent = require('../../component')

class ChassisTagComponent extends ChassisComponent {
	constructor	(chassis, customSpec) {
		super(chassis, 'tag', customSpec)
		
		this.selectors = ['.tag']
		this.resetType = 'inline'
		
		this.baseTypography = chassis.settings.typography.ranges.first.typography
	}
	
	get variables () {
		let { settings, typography, utils } = this.chassis
    let { fontSize, lineHeight } = settings.typography.ranges.first.typography.small

    let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
    let inlineHeight = typography.calculateInlineHeight(lineHeightMultiplier)
		let padding = (inlineHeight - lineHeightMultiplier) / 2
		
		let iconDimension = `${lineHeightMultiplier - (settings.typography.scaleRatio - 1)}em`
		let iconOffset = `-${(Math.log(lineHeightMultiplier) / 2) - utils.units.toEms(fontSize / (settings.typography.scaleRatio * 10), fontSize)}em`
		
		if (iconOffset < 0) {
			iconOffset = 0
		}

    return {
			'font-size': `${utils.units.toEms(fontSize, this.baseTypography.root.fontSize)}em`,
      // 'padding-x': `${Math.log(lineHeightMultiplier)}em`,
      'line-height': `${lineHeightMultiplier}`,
			'icon-width': iconDimension,
			'icon-height': iconDimension,
			'icon-offset': `translateX(${iconOffset})`
    }
	}
}

module.exports = ChassisTagComponent
