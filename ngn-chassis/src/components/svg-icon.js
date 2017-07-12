const ChassisComponent = require('../component')

class ChassisSvgIconComponent extends ChassisComponent {
	constructor	(chassis) {
		super(chassis)
		
		this.baseTypography = chassis.settings.typography.ranges.first.typography
		
		this.selectors = ['svg.icon']
		this.extensions = NGN.coalesce(chassis.extensions.icon, null)
	}

	get css () {
		let { settings, utils } = this.chassis
		let { rules } = this

		return utils.css.newRoot(rules)
	}

	get default () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		let lineHeightInEms = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRule(this.generateSelectorList(), [
			utils.css.newDeclObj('width', 'auto'),
			utils.css.newDeclObj('height', `${lineHeightInEms}em`),
			utils.css.newDeclObj('vertical-align', 'middle'),
			utils.css.newDeclObj('pointer-events', 'none'),
			...this.getThemeDecls('icon')
		])
	}
}

module.exports = ChassisSvgIconComponent
