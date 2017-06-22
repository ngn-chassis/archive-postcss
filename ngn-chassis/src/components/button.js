class ChassisButtonComponent {
	constructor	(chassis, cfg) {
		this.chassis = chassis
		this.cfg = cfg || null
		
		this.baseTypography = chassis.settings.typography.ranges.first.typography
		
		this.states = [
			'visited',
			'hover',
			'active',
			'disabled',
			'focus'
		]
	}
	
	// TODO: Add reset for <button> elements,
	// Move inline-layout stuff to a mixin that returns decls,
	// figure out how to approach theming,
	// figure out what to do about multi-line buttons
	
	get css () {
		let { css } = this.chassis.utils
		
		return css.newRoot([
			this.default
		])
	}
	
	get default () {
		let { typography, utils } = this.chassis
		let { fontSize, lineHeight } = this.baseTypography.root
		
		let lineHeightInEms = utils.units.toEms(lineHeight, fontSize)
		
		return utils.css.newRoot([
			utils.css.newRule('.chassis .button, .chassis button', [
				utils.css.newDeclObj('display', 'inline-flex'),
				utils.css.newDeclObj('justify-content', 'center'),
				utils.css.newDeclObj('align-items', 'center'),
				utils.css.newDeclObj('margin', `0 ${typography.calculateInlineMarginX(lineHeightInEms)}em ${typography.calculateInlineMarginY(lineHeightInEms)}em 0`),
				utils.css.newDeclObj('padding', `0 ${typography.calculateInlinePaddingX(lineHeightInEms)}em`),
				utils.css.newDeclObj('line-height', `${typography.calculateInlineHeight(lineHeightInEms)}em`),
				utils.css.newDeclObj('vertical-align', 'baseline'),
				utils.css.newDeclObj('text-align', 'center'),
				utils.css.newDeclObj('cursor', 'pointer'),
				utils.css.newDeclObj('user-select', 'none')
			]),
			utils.css.newRule('.chassis .disabled.button, .chassis button.disabled', [
				utils.css.newDeclObj('pointer-events', 'none'),
			])
		])
	}
}

module.exports = ChassisButtonComponent
