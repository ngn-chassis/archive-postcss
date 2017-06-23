const ChassisViewportWidthRangeModel = require('./models/viewport-width-range.js')
const ChassisLayoutModel = require('./models/layout.js')
const ChassisTypographyModel = require('./models/typography.js')

class ChassisSettings extends NGN.EventEmitter {
	constructor (chassis) {
		super()

		let model = new NGN.DATA.Model({
			relationships: {
				viewportWidthRanges: [new ChassisViewportWidthRangeModel(chassis)],
				layout: new ChassisLayoutModel(chassis),
				typography: new ChassisTypographyModel(chassis)
			},

			fields: {
				theme: {
					type: String,
					default: '../stylesheets/default-theme.css'
				},
				
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
		})

		return new model()
	}
}

module.exports = ChassisSettings
