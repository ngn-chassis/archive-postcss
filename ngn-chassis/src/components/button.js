const ChassisComponent = require('../component')

class ChassisButtonComponent extends ChassisComponent {
	constructor	(chassis, theme, selectors = ['button'], states = {
		'default': [''],
		'visited': [':visited'],
		'hover': [':hover'],
		'active': [':active'],
		'disabled': ['[disabled]', '.disabled'],
		'focus': [':focus'],
		'icon': [' svg.icon'],
		'pill': ['.pill'],
		'multi-line': ['.multi-line']
	}, extensions = NGN.coalesce(chassis.extensions.button, null), resetType = 'inline-block') {
		super(chassis, theme, selectors, states, extensions, resetType)
		this.baseTypography = chassis.settings.typography.ranges.first.typography
	}

	get default () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return [
			utils.css.newDeclObj('display', 'inline-flex'),
			utils.css.newDeclObj('justify-content', 'center'),
			utils.css.newDeclObj('align-items', 'center'),
			utils.css.newDeclObj('margin', `0 ${typography.calculateInlineMarginX(lineHeightMultiplier)}em ${typography.calculateInlineMarginY(lineHeightMultiplier)}em 0`),
			utils.css.newDeclObj('padding', `0 ${typography.calculateInlinePaddingX(lineHeightMultiplier)}em`),
			utils.css.newDeclObj('line-height', `${typography.calculateInlineHeight(lineHeightMultiplier)}`),
			utils.css.newDeclObj('vertical-align', 'middle'),
			utils.css.newDeclObj('text-align', 'center'),
			utils.css.newDeclObj('white-space', 'nowrap'),
			utils.css.newDeclObj('cursor', 'pointer'),
			utils.css.newDeclObj('user-select', 'none'),
		]
	}

	get disabled () {
		let { utils } = this.chassis
		return [utils.css.newDeclObj('pointer-events', 'none')]
	}

	get icon () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		let offset = `-${(typography.calculateInlinePaddingX(lineHeightMultiplier) / 2) - utils.units.toEms(fontSize / (settings.typography.scaleRatio * 10), fontSize)}em`

		return [utils.css.newDeclObj('transform', `translateX(${offset})`)]
	}

	get pill () {
		let { settings, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return [
			utils.css.newDeclObj('padding-left', `${settings.typography.scaleRatio}em`),
			utils.css.newDeclObj('padding-right', `${settings.typography.scaleRatio}em`),
			utils.css.newDeclObj('border-radius', `${lineHeightMultiplier}em`)
		]
	}

	get 'multi-line' () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		let inlineHeight = typography.calculateInlineHeight(lineHeightMultiplier)
		let padding = (inlineHeight - lineHeightMultiplier) / 2

		return [
			utils.css.newDeclObj('padding-top', `${padding}em`),
			utils.css.newDeclObj('padding-bottom', `${padding}em`),
			utils.css.newDeclObj('line-height', `${lineHeightMultiplier}`),
			utils.css.newDeclObj('white-space', 'normal')
		]
	}
	
	get legacy () {
		let { atRules, utils } = this.chassis
		
		return atRules.browserMixins.ieOnly({
			nodes: [
				utils.css.newRule('button, button:focus, button:active', [
					utils.css.newDeclObj('background', 'none'),
					utils.css.newDeclObj('border', 'none'),
					utils.css.newDeclObj('outline', 'none'),
					utils.css.newDeclObj('color', 'inherit')
				]),
				utils.css.newRule('button span', [
					utils.css.newDeclObj('position', 'relative')
				])
			]
		})
	}
}

module.exports = ChassisButtonComponent
