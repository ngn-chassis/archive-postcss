'use strict'

require('ngn')

class Chassis extends NGN.EventEmitter {
	constructor(cfg) {

		cfg = cfg || {}

		super()

		const defaultMinWidth = 320
		const defaultMaxWidth = 1440
		const goldenRatio = 1.61803398875

		Object.defineProperties(this, {
			constants: NGN.privateconst({
				math: {
					goldenRatio: goldenRatio
				},
				typography: {
					headingAliases: {
						'1': 'larger',
						'2': 'large',
						'3': 'root',
						'4': 'small',
						'5': 'small',
						'6': 'small'
					},
					formLegendAlias: 'large',
					definitions: [
						{
							lowerBound: 0,
							upperBound: 320,
							fontSizes: {
								root: 14,
								small: 11,
								large: 18,
								larger: 23,
								largest: 37
							}
						},
						{
							lowerBound: 320,
							upperBound: 512,
							fontSizes: {
								root: 15,
								small: 12,
								large: 19,
								larger: 24,
								largest: 39
							}
						},
						{
							lowerBound: 512,
							upperBound: 768,
							fontSizes: {
								root: 16,
								small: 13,
								large: 20,
								larger: 26,
								largest: 42
							}
						},
						{
							lowerBound: 768,
							upperBound: 1024,
							fontSizes: {
								root: 17,
								small: 13,
								large: 22,
								larger: 28,
								largest: 45
							}
						},
						{
							lowerBound: 1024,
							upperBound: 1200,
							fontSizes: {
								root: 18,
								small: 14,
								large: 23,
								larger: 29,
								largest: 47
							}
						},
						{
							lowerBound: 1200,
							upperBound: 1440,
							fontSizes: {
								root: 19,
								small: 15,
								large: 24,
								larger: 31,
								largest: 50
							}
						},
						{
							lowerBound: 1440,
							upperBound: 1600,
							fontSizes: {
								root: 20,
								small: 16,
								large: 25,
								larger: 32,
								largest: 52
							}
						},
						{
							lowerBound: 1600,
							upperBound: 1920,
							fontSizes: {
								root: 21,
								small: 17,
								large: 27,
								larger: 34,
								largest: 55
							}
						},
						{
							lowerBound: 1920,
							upperBound: 2048,
							fontSizes: {
								root: 22,
								small: 17,
								large: 28,
								larger: 36,
								largest: 58
							}
						}
					]
				}
			}),
			defaultSettings: NGN.privateconst({
				layout: {
					gutter: '6.18vw',
					minWidth: defaultMinWidth,
					maxWidth: defaultMaxWidth
				},
				typography: {
					baseFontSize: 16,
					typeScaleRatio: goldenRatio,
					globalMultiplier: 1
				},
				viewportWidthRanges: [
					{
						name: 'tiny',
						lowerBound: defaultMinWidth,
						upperBound: 512
					},
					{
						name: 'small',
						lowerBound: 512,
						upperBound: 768
					},
					{
						name: 'medium',
						lowerBound: 768,
						upperBound: 1024
					},
					{
						name: 'large',
						lowerBound: 1024,
						upperBound: 1200
					},
					{
						name: 'huge',
						lowerBound: 1200,
						upperBound: defaultMaxWidth
					}
				],
				zIndex: {
					min: -1000,
					behind: -1,
					default: 1,
					front: 2,
					max: 1000
				}
			}),
						
			constructLayoutConfig: NGN.privateconst(custom => {
				const defaultSettings = this.defaultSettings.layout
				
				return {
					gutter: NGN.coalesce(custom.gutter, defaultSettings.gutter),
					minWidth: NGN.coalesce(custom.minWidth, defaultSettings.minWidth),
					maxWidth: NGN.coalesce(custom.maxWidth, defaultSettings.maxWidth)
				}
			}),
			
			constructTypographyConfig: NGN.privateconst(custom => {
				const defaultSettings = this.defaultSettings.typography
				
				return {
					typeScaleRatio: NGN.coalesce(custom.typeScaleRatio, defaultSettings.typeScaleRatio),
					globalMultiplier: NGN.coalesce(custom.globalMultiplier, defaultSettings.globalMultiplier)
				}
			}),

			constructViewportWidthRangesConfig: NGN.privateconst(custom => {
				const vwr = {}

				Object.keys(custom).forEach(key => {
					vwr[key] = custom[key]
				})

				return vwr
			}),
			
			constructZIndexConfig: NGN.privateconst(custom => {
				const defaultSettings = this.defaultSettings.zIndex
				
				return {
					min: NGN.coalesce(custom.min, defaultSettings.min),
					behind: NGN.coalesce(custom.behind, defaultSettings.behind),
					default: NGN.coalesce(custom.default, defaultSettings.default),
					front: NGN.coalesce(custom.front, defaultSettings.front),
					max: NGN.coalesce(custom.max, defaultSettings.max)
				}
			}),
			
			getFontSize: NGN.privateconst((type, upperBound) => {
				const match = this.constants.typography.definitions.filter(definition => {
					return upperBound >= definition.upperBound
				}).pop()
				
				if ( !match ) {
					console.log(`No Font Size found matching type: "${type}" at upper bound: "${upperBound}"`);
				}
				
				return match.fontSizes[type] * this.settings.typography.globalMultiplier
			}),
			
			getLineHeight: NGN.privateconst((type, upperBound) => {
				const fontSize = this.getFontSize(type, upperBound)
				
				return this.getOptimalLineHeight(fontSize, upperBound)
			}),
			
			getOptimalWidth: NGN.privateconst((fontSize, ratio) => {
				const lineHeight = Math.round(fontSize * ratio)
				
				return Math.pow(lineHeight, 2)
			}),
			
			getOptimalLineHeight: NGN.privateconst((fontSize, upperBound) => {
				const typeScaleRatio = this.settings.typography.typeScaleRatio
				const optimalLineWidth = this.getOptimalWidth(fontSize, typeScaleRatio)
				
				return Math.round((typeScaleRatio - ((1 / (2 * typeScaleRatio)) * (1 - (upperBound / optimalLineWidth)))) * fontSize)
			}),
			
			getHeadingMargin: NGN.privateconst((fontSize, upperBound) => {
				return Math.round(this.getLineHeight(fontSize, upperBound) / this.settings.typography.typeScaleRatio)
			}),
			
			getContainerMargin: NGN.privateconst((fontSize, upperBound) => {
				return Math.round(this.getLineHeight(fontSize, upperBound) * this.settings.typography.typeScaleRatio)
			}),
			
			getBlockMargin: NGN.privateconst((fontSize, upperBound) => {
				return this.getLineHeight(fontSize, upperBound)
			}),

			getLayoutGutter: NGN.public(() => {
				const layout = this.settings.layout
				
				if (!layout.gutter) {
					console.warn('Layout Gutter Value has not been set!')
					return ''
				}

				return layout.gutter
			}),

			getLayoutMinWidth: NGN.public(() => {
				const layout = this.settings.layout
				
				if (!layout.minWidth) {
					console.warn('Layout Minimum Width Value has not been set!')
					return ''
				}

				return `${layout.minWidth}px`
			}),

			getLayoutMaxWidth: NGN.public(() => {
				const layout = this.settings.layout
				
				if (!layout.maxWidth) {
					console.warn('Layout Maximum Width Value has not been set!')
					return ''
				}

				return `${layout.maxWidth}px`
			}),

			getViewportWidthBound: NGN.public((name, bound) => {
				const range = this.settings.viewportWidthRanges.filter(vwr => {
					return name === vwr.name
				})

				if ( !range ) {
					console.warn(`Viewport Width Range ${name} does not exist.`)
					return ''
				}

				return `${range[bound]}px`
			}),
			
			getMediaQueryValue: NGN.private((type, name) => {
				const viewportWidthRanges = this.settings.viewportWidthRanges
				let index = 0;
				
				const range = viewportWidthRanges.filter((vwr, i) => {
					index = i
					return name === vwr.name
				}).pop()
				
				if (!range) {
					console.warn(`Viewport Width Range ${name} does not exist.`)
					return ''
				}
				
				switch (type) {
					case 'below':
						return `${range.lowerBound - 1}px`
						break
					
					case 'max':
						return `${range.upperBound - 1}px`
						break
						
					case 'at-min':
						return `${range.lowerBound}px`
						break
						
					case 'at-max':
						return index === viewportWidthRanges.length ? `${range.upperBound}px` : `${range.upperBound - 1}px`
						break						
						
					case 'min':
						return `${range.lowerBound}px`
						break	
						
					case 'above':
						return `${range.upperBound + 1}px`
						break	
				}
			}),
			
			getViewportWidthRanges: NGN.private(() => {
				return this.settings.viewportWidthRanges
			}),
			
			getViewportWidthRangeName: NGN.private(index => {
				console.log(index);
				// return this.viewportWidthRanges[index].name
			}),
			
			getNumViewportWidthRanges: NGN.private(() => {
				return this.settings.viewportWidthRanges.length
			}),

			getUnit: NGN.const(value => {
				return value.match(/\D+$/)[0]
			}),
			
			stripUnits: NGN.const(value => {
				return value.match(/\D+$/)[1]
			}),

			warn: NGN.const(message => {
				console.warn(message)
			})
		})
		
		Object.defineProperty(this, 'settings', NGN.const({
			layout: cfg.hasOwnProperty('layout') ? this.constructLayoutConfig(cfg.layout) : this.defaultSettings.layout,
			typography: cfg.hasOwnProperty('typography') ? this.constructTypographyConfig(cfg.typography) : this.defaultSettings.typography,
			viewportWidthRanges: cfg.hasOwnProperty('viewportWidthRanges') ? this.constructViewportWidthRangesConfig(cfg.viewportWidthRanges) : this.defaultSettings.viewportWidthRanges,
			zIndex: cfg.hasOwnProperty('zIndex') ? this.constructZIndexConfig(cfg.zIndex) : this.defaultSettings.zIndex
		}))
	}
}

module.exports = Chassis