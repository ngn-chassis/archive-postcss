const ChassisComponent = require('../component')

class ChassisButtonComponent extends ChassisComponent {
	constructor	(chassis, cfg) {
		super(chassis)

		this.chassis = chassis
		this.cfg = cfg || null // TODO: use this for extending components
		
		this.baseTypography = chassis.settings.typography.ranges.first.typography
		
		this.states = [
			'default',
			'visited',
			'hover',
			'active',
			'disabled',
			'focus'
		]
	}

	// TODO:
	// - figure out what to do about multi-line buttons
	// - figure out how to handle .button and <button> separately

	get css () {
		let { atRules, settings, utils } = this.chassis
		let { rules } = this

		if (settings.supportIe) {
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

		settings.componentResetSelectors.push('.button, button')

		return utils.css.newRoot(rules)
	}

	get default () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root

		let lineHeightInEms = utils.units.toEms(lineHeight, fontSize)

		return utils.css.newRule('.button, button', [
			utils.css.newDeclObj('display', 'inline-flex'),
			utils.css.newDeclObj('justify-content', 'center'),
			utils.css.newDeclObj('align-items', 'center'),
			utils.css.newDeclObj('margin', `0 ${typography.calculateInlineMarginX(lineHeightInEms)}em ${typography.calculateInlineMarginY(lineHeightInEms)}em 0`),
			utils.css.newDeclObj('padding', `0 ${typography.calculateInlinePaddingX(lineHeightInEms)}em`),
			utils.css.newDeclObj('line-height', `${typography.calculateInlineHeight(lineHeightInEms)}em`),
			utils.css.newDeclObj('vertical-align', 'baseline'),
			utils.css.newDeclObj('text-align', 'center'),
			utils.css.newDeclObj('cursor', 'pointer'),
			utils.css.newDeclObj('user-select', 'none'),
			...this._getThemeDecls('button')
		])
	}

	get visited () {
		let { utils } = this.chassis

		return utils.css.newRule('.button:visited, button:visited', [
			...this._getThemeDecls('button.visited')
		])
	}

	get hover () {
		let { utils } = this.chassis

		return utils.css.newRule('.button:hover, button:hover', [
			...this._getThemeDecls('button.hover')
		])
	}

	get active () {
		let { utils } = this.chassis

		return utils.css.newRule('.button:active, button:active', [
			...this._getThemeDecls('button.active')
		])
	}

	get disabled () {
		let { utils } = this.chassis

		return utils.css.newRule('.button[disabled], button[disabled], .disabled.button, button.disabled', [
			utils.css.newDeclObj('pointer-events', 'none'),
			...this._getThemeDecls('button.disabled')
		])
	}

	get focus () {
		let { utils } = this.chassis

		return utils.css.newRule('.button:focus, button:focus', [
			...this._getThemeDecls('button.focus')
		])
	}
}

module.exports = ChassisButtonComponent
