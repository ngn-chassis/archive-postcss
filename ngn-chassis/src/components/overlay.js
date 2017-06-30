const ChassisComponent = require('../component')

class ChassisOverlayComponent extends ChassisComponent {
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

		return utils.css.newRule('chassis-overlay', [
			...this.getThemeDecls('overlay')
		])
	}
}

module.exports = ChassisOverlayComponent
