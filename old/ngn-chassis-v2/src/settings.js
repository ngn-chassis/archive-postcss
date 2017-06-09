const MustHave = require('musthave')

class ChassisSettings extends NGN.EventEmitter {
	constructor (chassis) {
		super()
		this.chassis = chassis
		
		this.viewportWidthRangeModel = new NGN.DATA.Model({
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
		
		this.layoutModel = new NGN.DATA.Model({
			fields: {
				gutter: {
					type: String,
					default: '6.18vw',
					pattern: /^(auto|0)$|^[0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc|vw|vh|rem)$/gi
				},
				minWidth: {
					type: Number,
					default: 320,
					min: 0
				},
				maxWidth: {
					type: Number,
					default: 1440,
					min: 0
				}
			}
		})
		
		this.typographyModel = new NGN.DATA.Model({
			relationships: {
				fontSizes: new NGN.DATA.Model({
					fields: {
						headings: {
							type: Object,
							default: {
								'1': '+2',
								'2': '+1',
								'3': 'root',
								'4': '-1',
								'5': '-1',
								'6': '-1'
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
							default: '+1'
						}
					}
				}),
				ranges: [new NGN.DATA.Model({
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
				})]
			},

			fields: {
				rootFontSize: {
					type: Number,
					default: 16,
					min: 1
				},
				typeScaleRatio: {
					type: Number,
					default: this.chassis.constants.goldenRatio,
					min: 0
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
		
		return new NGN.DATA.Model({
			relationships: {
				viewportWidthRanges: [this.viewportWidthRangeModel],
				layout: this.layoutModel,
				typography: this.typographyModel
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
		})()
	}
}

module.exports = ChassisSettings
