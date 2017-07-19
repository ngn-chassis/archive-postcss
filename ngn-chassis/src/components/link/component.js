const ChassisComponent = require('../../component')

class ChassisLinkComponent extends ChassisComponent {
	constructor	(chassis, theme) {
		super(chassis, theme)
		
		this.name = 'link'
		this.selectors = ['a']
		this.resetType = 'inline'
	}
	
	postCallback () {
		// All decls applied to <a> tags will be unset or overridden on other
		// components that use <a> tags in conjunction with a class or attr
		this.states.forEach((state) => {
			let theme = this.getStateTheme(state)
			
			if (!theme || Object.keys(theme).length === 0) {
				return
			}
			
			this.chassis.linkOverrides.push({
				state,
				properties: theme.properties,
				rules: theme.rules
			})
		})
	}
}

module.exports = ChassisLinkComponent
