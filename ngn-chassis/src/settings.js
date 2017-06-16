class ChassisSettings extends NGN.EventEmitter {
	constructor (chassis) {
		super()

		let viewportWidthRangeModel = new NGN.DATA.Model({
			fields: {
				name: {
					type: String,
					pattern: /^\S*$/gi
				},
				lowerBound: {
					type: Number,
					validate (value) {
						return value < this.upperBound
					}
				},
				upperBound: {
					type: Number,
					validate (value) {
						return value > this.lowerBound
					}
				}
			}
		})

		let layoutModel = new NGN.DATA.Model({
			fields: {
				breakpoints: {
					type: String,
					default: '0 tiny 320 small 512 medium 768 large 1024 huge 1440 massive 1600'
				},
				gutter: {
					type: String,
					default: '6.18vw',
					pattern: /^(auto|0)$|^[0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc|vw|vh|rem)$/gi
				},
				minWidth: {
					type: Number,
					default: chassis.constants.layout.viewport.minWidth,
					min: 0
				},
				maxWidth: {
					type: Number,
					default: chassis.constants.layout.viewport.maxWidth,
					min: 0
				}
			}
		})

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

		let themeModel = new NGN.DATA.Model({
			relationships: {
				typography: fontModel
			}
		})

		let fontSizeModel = new NGN.DATA.Model({
			fields: {
				headings: {
					type: Object,
					default: {
						'1': 'larger',
						'2': 'large',
						'3': 'root',
						'4': 'small',
						'5': 'small',
						'6': 'small'
					},
					validate (data) {
						let mh = new MustHave()

						if (!mh.hasExactly(data, '1', '2', '3', '4', '5', '6')) {
							return false
						}

						return Object.keys(data).every(key => {
							return typeof data[key] === 'string'
						})
					}
				},
				formLegend: {
					type: String,
					default: 'large'
				}
			}
		})

		let rangeModel = new NGN.DATA.Model({
			fields: {
				bounds: {
					type: Object,
					validate (data) {
						// TODO: Add validation

						return true
					}
				},
				typography: {
					type: Object
				}
			}
		})

		let typographyModel = new NGN.DATA.Model({
			relationships: {
				fontSizes: fontSizeModel,
				ranges: [rangeModel]
			},

			fields: {
				baseFontSize: {
					type: Number,
					default: 16,
					min: 1
				},
				scaleRatio: {
					type: Number,
					default: chassis.constants.typography.scale.ratios['golden ratio'],
					min: 0,
					validate (ratio) {
						// TODO: Validate this against the values in constants so that the
						// the value of this property can just be 'golden ratio'
						console.log(`Validating type scale ratio. Current value: ${ratio}`);
						return true
					}
				},
				fontWeights: {
					type: Object,
					default: {
						thin: 100,
						light: 300,
						regular: 400,
						semibold: 500,
						bold: 700,
						ultra: 900
					},
					validate (data) {
						let legitimateValues = ['normal', 'bold', 'lighter', 'bolder', '100', '200', '300', '400', '500', '600', '700', '800', '900']

						return Object.keys(data).every(key => {
							return legitimateValues.includes(data[key].toString().trim().toLowerCase())
						})
					}
				}
			}
		})

		let settingsModel = new NGN.DATA.Model({
			relationships: {
				viewportWidthRanges: [viewportWidthRangeModel],
				layout: layoutModel,
				theme: themeModel,
				typography: typographyModel
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
		})

		return new settingsModel()
	}
}

module.exports = ChassisSettings
