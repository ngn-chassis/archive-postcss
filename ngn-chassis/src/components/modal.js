const ChassisComponent = require('../component')

class ChassisModalComponent extends ChassisComponent {
	constructor	(chassis, cfg) {
		super(chassis)

		this.chassis = chassis
		this.cfg = cfg || null
	}

	get css () {
		let { settings, utils } = this.chassis
		let { rules } = this

		return utils.css.newRoot(rules)
	}

	get default () {
		let { utils } = this.chassis

		return utils.css.newRule('chassis-modal', [
			...this._getThemeDecls('modal')
		])
	}
}

module.exports = ChassisModalComponent
