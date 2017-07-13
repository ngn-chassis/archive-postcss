class ChassisPost {
	constructor (chassis) {
		this.chassis = chassis
	}
	
	'component-reset' () {
		let { settings, utils } = this.chassis
    let { atRule, args, nodes } = arguments[0]
		let output = arguments[1]
		
		let type = args[0]
		let list = settings.componentResetSelectorLists[type]

		if (list.length > 0) {
			output.insertBefore(atRule, utils.css.newRule(list, nodes))
		}
		
		output.removeChild(atRule)
	}
	
	process (data, output) {
		if (data.mixin in this) {
			this[data.mixin](data, output)
			return
		}

		console.error(`[ERROR] Chassis Post-Processing: Mixin "${data.mixin}" not found.`)
	}
}

module.exports = ChassisPost
