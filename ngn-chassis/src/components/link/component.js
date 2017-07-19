const ChassisComponent = require('../../component')

class ChassisLinkComponent extends ChassisComponent {
	constructor	(chassis, theme) {
		super(chassis, theme)
		
		this.name = 'link'
		this.selectors = ['a']
		this.resetType = 'inline'
		
		// All decls applied to <a> tags. These will be unset or overridden on
		// other components that use <a> tags in conjunction with a class or attr
		for (let state in this.states) {
			this.chassis.linkOverrides.push({
				state,
				decls: []// this.getThemeDecls(state)
			})
		}
	}
}

module.exports = ChassisLinkComponent
