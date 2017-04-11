const ViewportWidthRangeModel = require('./viewport-width-range')
const LayoutModel = require('./layout')
const TypographyModel = require('./typography')

module.exports = new NGN.DATA.Model({
	relationships: {
		viewportWidthRanges: [ViewportWidthRangeModel],
		layout: LayoutModel,
		typography: TypographyModel
	},

	fields: {
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
