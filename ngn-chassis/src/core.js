class ChassisCore {
	constructor (chassis) {
		this.chassis = chassis
		
		this.css = chassis.utils.newRoot([
			this.reset,
			this.modifiers,
			this.widthConstraint,
			this.rootElement,
			// this.headings
		])
	}
	
	get reset () {
		return this.chassis.utils.parseStylesheet('stylesheets/reset.css')
	}
	
	get modifiers () {
		return this.chassis.utils.parseStylesheet('stylesheets/global-modifiers.css')
	}
	
	get widthConstraint () {
		let { settings, utils } = this.chassis
		
		return utils.newRule('.width-constraint', [])
	}
	
	get rootElement () {
		let { settings, utils } = this.chassis
		
		return utils.newRule('.chassis', [
			utils.newDeclObj('min-width', settings.layout.minWidth)
		])
	}
	
	get headings () {
		let css = []
		
		return css
	}
}

module.exports = ChassisCore
