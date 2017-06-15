class ChassisThemeModel {
	constructor (chassis) {
		this.chassis = chassis
		
		let typography = new NGN.DATA.Model({
			fields: {
				'font-family': {
					type: String,
					default: 'Helvetica, Arial, sans-serif'
				}
			}
		})
		
		return new NGN.DATA.Model({
			relationships: {typography}
		})
	}
}

module.exports = ChassisThemeModel
