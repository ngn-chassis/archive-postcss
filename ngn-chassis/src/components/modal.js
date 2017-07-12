const ChassisComponent = require('../component')

class ChassisModalComponent extends ChassisComponent {
	constructor	(chassis) {
		super(chassis)

		this.selectors = ['chassis-modal']
		this.extensions = NGN.coalesce(chassis.extensions.modal, null)
	}

	get css () {
		let { settings, utils } = this.chassis
		let { rules } = this

		return utils.css.newRoot(rules)
	}

	get default () {
		let { utils } = this.chassis

		return utils.css.newRule('chassis-modal', [
			...this.getThemeDecls('modal')
		])
	}
}

module.exports = ChassisModalComponent
