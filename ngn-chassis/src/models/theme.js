class ChassisThemeModel {
  constructor (chassis) {
    let fontModel = new NGN.DATA.Model({
			fields: {
				'font-family': {
					type: String,
					default: 'Helvetica, Arial, sans-serif',
					validate: function (value) {
						return true
					}
				}
			}
		})

    return new NGN.DATA.Model({
			relationships: {
				typography: fontModel
			}
		})
  }
}

module.exports = ChassisThemeModel
