const ChassisComponent = require('../component')

class ChassisOverlayComponent extends ChassisComponent {
	constructor	(chassis) {
		super(chassis)
		
		this.selectors = ['chassis-overlay']
		this.extensions = NGN.coalesce(chassis.extensions.overlay, null)
	}

	get css () {
		let { settings, utils } = this.chassis
		let { rules } = this

		return utils.css.newRoot(rules)
	}

	get default () {
		let { utils } = this.chassis

		return utils.css.newRule('chassis-overlay', [
			...this.getThemeDecls('overlay')
		])
	}
}

module.exports = ChassisOverlayComponent
