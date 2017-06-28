class ChassisComponent {
	constructor (chassis) {
		this.chassis = chassis
	}
	
	_getThemeDecls (component) {
		let { theme, utils } = this.chassis
		let decls = theme.getComponentProperties(component)
		
		if (decls) {
			return Object.keys(decls).map((decl) => utils.css.newDeclObj(decl, decls[decl]))
		}
		
		return []
	}
}

module.exports = ChassisComponent
