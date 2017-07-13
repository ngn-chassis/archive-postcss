const ChassisComponent = require('../component')

class ChassisOverlayComponent extends ChassisComponent {
	constructor	(chassis, theme) {
		super(chassis, theme)
		
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

		return utils.css.newRule(this.generateSelectorList(), [
			...this.getThemeDecls('default')
		])
	}
}

module.exports = ChassisOverlayComponent
