class ChassisComponent {
	constructor (chassis) {
		this.chassis = chassis
	}
	
	get rules () {
		if (this.states && this.states.length > 0) {
			return this.states.map((state) => {
				let rule = this[state]
				
				if (rule.nodes.length > 0) {
					return rule
				}
			}).filter((rule) => rule !== undefined)
		}
		
		return this.default && this.default.nodes.length > 0 ? [this.default] : null
	}
	
	_getThemeDecls (state) {
		let { theme, utils } = this.chassis
		let decls = theme.getComponentProperties(state)
		
		if (decls) {
			return Object.keys(decls).map((decl) => utils.css.newDeclObj(decl, decls[decl]))
		}
		
		return []
	}
}

module.exports = ChassisComponent
