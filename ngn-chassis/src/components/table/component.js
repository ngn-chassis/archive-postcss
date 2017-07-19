const ChassisComponent = require('../../component')

class ChassisTableComponent extends ChassisComponent {
	constructor	(chassis, theme) {
		super(chassis, theme)
		
		this.name = 'table'
		this.selectors = ['table']
		this.resetType = 'block'
	}
	
	get variables () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = settings.typography.ranges.first.typography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		
		return {
			'cell-padding-x': `${typography.calculateInlinePaddingX(lineHeightMultiplier)}em`,
			'cell-line-height': `${typography.calculateInlineHeight(lineHeightMultiplier)}`
		}
	}
}

module.exports = ChassisTableComponent
