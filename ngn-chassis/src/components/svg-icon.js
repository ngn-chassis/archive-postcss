const ChassisComponent = require('../component')

class ChassisSvgIconComponent extends ChassisComponent {
	constructor	(chassis, theme, selectors = ['svg.icon'], states = {
		
	}, extensions = NGN.coalesce(chassis.extensions.icon, null), resetType = 'inline-block') {
		super(chassis, theme, selectors, states, extensions, resetType)
		this.baseTypography = chassis.settings.typography.ranges.first.typography
	}

	get default () {
		let { utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		let lineHeightInEms = utils.units.toEms(lineHeight, fontSize)

		return [
			utils.css.newDeclObj('width', 'auto'),
			utils.css.newDeclObj('height', `${lineHeightInEms}em`),
			utils.css.newDeclObj('vertical-align', 'middle'),
			utils.css.newDeclObj('pointer-events', 'none'),
		]
	}
}

module.exports = ChassisSvgIconComponent
