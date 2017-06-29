const ChassisComponent = require('../component')

class ChassisTagComponent extends ChassisComponent {
	constructor	(chassis, cfg) {
		super(chassis)

		this.chassis = chassis
		this.cfg = cfg || null
		
		this.baseTypography = chassis.settings.typography.ranges.first.typography
	}

	get css () {
		let { settings, utils } = this.chassis
		let { rules } = this

		settings.componentResetSelectors.push('.tag')

		return utils.css.newRoot(rules)
	}

	get default () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.small
		
		let lineHeightInEms = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRule('.tag', [
			utils.css.newDeclObj('display', 'inline-flex'),
			utils.css.newDeclObj('justify-content', 'center'),
			utils.css.newDeclObj('align-items', 'center'),
			utils.css.newDeclObj('margin', '0'),
			utils.css.newDeclObj('padding', `0 ${lineHeightInEms / 2}em`),
			utils.css.newDeclObj('font-size', `${utils.units.toEms(fontSize, this.baseTypography.root.fontSize)}em`),
			utils.css.newDeclObj('line-height', `${lineHeightInEms}em`),
			utils.css.newDeclObj('vertical-align', 'baseline'),
			...this._getThemeDecls('tag')
		])
	}
}

module.exports = ChassisTagComponent
