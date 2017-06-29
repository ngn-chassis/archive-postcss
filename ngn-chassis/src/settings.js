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
				componentSelectors: {
					type: Array,
					default: []
				},
				
				plugins: {
					type: Array,
					default: []
				},
				
				theme: {
					type: String,
					default: chassis.constants.theme.defaultFilePath,
					validate (filepath) {
						let filename = chassis.utils.files.getFileName(filepath)
						return chassis.utils.files.getFileExtension(filename) === '.css'
					}
				},
				
				supportIe: {
					type: Boolean,
					default: true
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
			},
			
			virtuals: {
				componentSelectorList () {
					let selectors = this.componentSelectors.map((selectorString) => {
						selectorString = `.chassis ${selectorString.trim()}`
						
						if (selectorString.includes(',')) {
							return selectorString.split(',').map((selector) => selector.trim()).join(', .chassis ')
						}
						
						return selectorString
					})
					
					return selectors.join(', ')
				}
 			}
		})

		return new model()
	}
}

module.exports = ChassisSettings
