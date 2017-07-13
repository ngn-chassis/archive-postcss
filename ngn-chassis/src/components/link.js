const ChassisComponent = require('../component')

class ChassisLinkComponent extends ChassisComponent {
	constructor	(chassis, theme, selectors = ['a'], states = {
		'default': [''],
		'visited': [':visited'],
		'hover': [':hover'],
		'active': [':active'],
		'disabled': ['[disabled]', '.disabled'],
		'focus': [':focus']
	}, extensions = NGN.coalesce(chassis.extensions.link, null), resetType = 'inline') {
		super(chassis, theme, selectors, states, extensions, resetType)
		
		// All decls applied to <a> tags. These will be unset or overridden on
		// other components that use <a> tags in conjunction with a class or attr
		for (let state in this.states) {
			this.chassis.linkOverrides.push({
				state,
				decls: this.getThemeDecls(state)
			})
		}
	}

	get disabled () {
		let { utils } = this.chassis
		
		return [
			utils.css.newDeclObj('cursor', 'default'),
			utils.css.newDeclObj('pointer-events', 'none')
		]
	}
}

module.exports = ChassisLinkComponent
