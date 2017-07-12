const ChassisComponent = require('../component')

class ChassisButtonComponent extends ChassisComponent {
	constructor	(chassis) {
		super(chassis)

		this.baseTypography = chassis.settings.typography.ranges.first.typography

		this.states = [
			'default',
			'visited',
			'hover',
			'active',
			'disabled',
			'focus',
			'icon',
			'pill',
			'multi-line'
		]

		this.variants = {
			'class': '.button',
			'tag': 'button'
		}
		
		// TODO: Use this to determine which reset to use
		this.type = 'inline-block'
		this.selectors = ['.button', 'button']
		this.extensions = NGN.coalesce(chassis.extensions.button, null)
	}

	get css () {
		let { atRules, settings, theme, utils } = this.chassis
		let { rules } = this

		if (settings.legacy) {
			rules.push(atRules.browserMixins.ieOnly({
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
			}))
		}

		return utils.css.newRoot(rules)
	}

	get default () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRule(this.generateSelectorList(), [
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
			...this.getThemeDecls('button')
		])
	}

	get visited () {
		let { utils } = this.chassis

		return utils.css.newRule(this.generateSelectorList(null, ':visited'), [
			...this.getThemeDecls('button.visited')
		])
	}

	get hover () {
		let { utils } = this.chassis

		return utils.css.newRule(this.generateSelectorList(null, ':hover'), [
			...this.getThemeDecls('button.hover')
		])
	}

	get active () {
		let { utils } = this.chassis

		return utils.css.newRule(this.generateSelectorList(null, ':active'), [
			...this.getThemeDecls('button.active')
		])
	}

	get disabled () {
		let { utils } = this.chassis

		return utils.css.newRule(`${this.generateSelectorList(null, '[disabled]')}, ${this.generateSelectorList(null, '.disabled')}`, [
			utils.css.newDeclObj('pointer-events', 'none'),
			...this.getThemeDecls('button.disabled')
		])
	}

	get focus () {
		let { utils } = this.chassis

		return utils.css.newRule(this.generateSelectorList(null, ':focus'), [
			...this.getThemeDecls('button.focus')
		])
	}

	get icon () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		let offset = `-${(typography.calculateInlinePaddingX(lineHeightMultiplier) / 2) - utils.units.toEms(fontSize / (settings.typography.scaleRatio * 10), fontSize)}em`

		return utils.css.newRule(this.generateSelectorList(null, ' svg.icon'), [
			utils.css.newDeclObj('transform', `translateX(${offset})`),
			...this.getThemeDecls('button.icon')
		])
	}

	get pill () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRule(this.generateSelectorList(null, '.pill'), [
			utils.css.newDeclObj('padding-left', `${settings.typography.scaleRatio}em`),
			utils.css.newDeclObj('padding-right', `${settings.typography.scaleRatio}em`),
			utils.css.newDeclObj('border-radius', `${lineHeightMultiplier}em`),
			...this.getThemeDecls('button.pill')
		])
	}

	get 'multi-line' () {
		let { settings, typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
		let inlineHeight = typography.calculateInlineHeight(lineHeightMultiplier)

		let padding = (inlineHeight - lineHeightMultiplier) / 2

		return utils.css.newRule(this.generateSelectorList(null, '.multi-line'), [
			utils.css.newDeclObj('padding-top', `${padding}em`),
			utils.css.newDeclObj('padding-bottom', `${padding}em`),
			utils.css.newDeclObj('line-height', `${lineHeightMultiplier}`),
			utils.css.newDeclObj('white-space', 'normal'),
			...this.getThemeDecls('button.multi-line')
		])
	}
}

module.exports = ChassisButtonComponent
