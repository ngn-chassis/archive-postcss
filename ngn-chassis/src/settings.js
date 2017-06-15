const ChassisLayoutModel = require('./models/layout.js')
const ChassisThemeModel = require('./models/theme.js')
const ChassisTypographyModel = require('./models/typography.js')
const ChassisViewportWidthRangeModel = require('./models/viewport-width-range.js')

class ChassisSettings extends NGN.EventEmitter {
	constructor (chassis) {
		super()
		this.chassis = chassis

		return new NGN.DATA.Model({
			relationships: {
				viewportWidthRanges: [new ChassisViewportWidthRangeModel(chassis)],
				layout: new ChassisLayoutModel(chassis),
				theme: new ChassisThemeModel(chassis),
				typography: new ChassisTypographyModel(chassis)
			},

			fields: {
				plugins: {
					type: Array,
					default: []
				},
				
				zIndex: {
					type: Object,
					default: {
						min: -1000,
						behind: -1,
						default: 1,
						front: 2,
						max: 1000
					},

					validate (data) {
						return Object.keys(data).every(key => {
							return typeof data[key] === 'number'
								&& data[key] > (-2147483648)
								&& data[key] < 2147483647
						})
					}
				}
			}
		})()
	}
}

module.exports = ChassisSettings
