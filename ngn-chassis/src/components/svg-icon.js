const ChassisComponent = require('../component')

class ChassisSvgIconComponent extends ChassisComponent {
	constructor	(chassis, cfg) {
		super(chassis)

		this.chassis = chassis
		this.cfg = cfg || null
		
		this.baseTypography = chassis.settings.typography.ranges.first.typography
	}

	get css () {
		let { settings, utils } = this.chassis
		let { rules } = this

		settings.componentResetSelectors.push('.icon')

		return utils.css.newRoot(rules)
	}

	get default () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		let lineHeightInEms = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRule('svg.icon', [
			utils.css.newDeclObj('width', 'auto'),
			utils.css.newDeclObj('height', `${lineHeightInEms}em`),
			utils.css.newDeclObj('vertical-align', 'middle'),
			utils.css.newDeclObj('pointer-events', 'none'),
			...this._getThemeDecls('icon')
		])
	}
}

module.exports = ChassisSvgIconComponent
