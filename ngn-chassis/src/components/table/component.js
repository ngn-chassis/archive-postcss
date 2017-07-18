const ChassisComponent = require('../../component')

class ChassisTableComponent extends ChassisComponent {
	constructor	(chassis, theme, selectors = ['table'], states = {
		'default': [''],
		'th': [' th'],
		'td': [' td'],
		'caption': [' caption']
	}, extensions = NGN.coalesce(chassis.extensions.table, null), resetType = 'block') {
		super(chassis, 'table', theme, selectors, states, extensions, resetType)
		this.baseTypography = chassis.settings.typography.ranges.first.typography
	}

	get default () {
		let { utils } = this.chassis

		return [
			utils.css.newDeclObj('table-layout', 'fixed'),
			utils.css.newDeclObj('width', '100%'),
			utils.css.newDeclObj('border', '0'),
			utils.css.newDeclObj('border-collapse', 'collapse'),
			utils.css.newDeclObj('border-spacing', '0')
		]
	}

	get th () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return [
			utils.css.newDeclObj('overflow', 'hidden'),
			utils.css.newDeclObj('padding', `0 ${typography.calculateInlinePaddingX(lineHeightMultiplier)}em`),
			utils.css.newDeclObj('line-height', `${typography.calculateInlineHeight(lineHeightMultiplier)}`),
			utils.css.newDeclObj('text-align', 'left'),
			utils.css.newDeclObj('text-overflow', 'ellipsis'),
			utils.css.newDeclObj('vertical-align', 'top')
		]
	}

	get td () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return [
			utils.css.newDeclObj('overflow', 'hidden'),
			utils.css.newDeclObj('padding', `0 ${typography.calculateInlinePaddingX(lineHeightMultiplier)}em`),
			utils.css.newDeclObj('line-height', `${typography.calculateInlineHeight(lineHeightMultiplier)}`),
			utils.css.newDeclObj('text-align', 'left'),
			utils.css.newDeclObj('text-overflow', 'ellipsis'),
			utils.css.newDeclObj('vertical-align', 'top')
		]
	}

	get caption () {
		let { utils } = this.chassis

		return [utils.css.newDeclObj('text-align', 'left')]
	}
}

module.exports = ChassisTableComponent
