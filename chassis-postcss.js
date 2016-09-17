'use strict'

require('ngn')

class ChassisProject extends NGN.EventEmitter {
	constructor(cfg) {

		cfg = cfg || {}

		super()

		const defaultMinWidth = 320
		const defaultMaxWidth = 1440
		const goldenRatio = 1.61803398875

		Object.defineProperties(this, {
			constants: NGN.const({
				math: {
					goldenRatio: goldenRatio
				}
			}),
			defaults: NGN.privateconst({
				layout: {
					gutter: '6.18vw',
					minWidth: defaultMinWidth,
					maxWidth: defaultMaxWidth
				},
				typography: {
					baseFontSize: 16,
					typeScaleRatio: goldenRatio,
					globalMultiplier: 1,
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
				const defaults = this.defaults.layout
				
				return {
					gutter: NGN.coalesce(custom.gutter, defaults.gutter),
					minWidth: NGN.coalesce(custom.minWidth, defaults.minWidth),
					maxWidth: NGN.coalesce(custom.maxWidth, defaults.maxWidth)
				}
			}),
			
			constructTypographyConfig: NGN.privateconst(custom => {
				const defaults = this.defaults.typography
				
				return {
					typeScaleRatio: NGN.coalesce(custom.typeScaleRatio, defaults.typeScaleRatio),
					globalMultiplier: NGN.coalesce(custom.globalMultiplier, defaults.globalMultiplier)
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
				const defaults = this.defaults.zIndex
				
				return {
					min: NGN.coalesce(custom.min, defaults.min),
					behind: NGN.coalesce(custom.behind, defaults.behind),
					default: NGN.coalesce(custom.default, defaults.default),
					front: NGN.coalesce(custom.front, defaults.front),
					max: NGN.coalesce(custom.max, defaults.max)
				}
			}),

			getLayoutGutter: NGN.const(() => {
				const layout = this.settings.layout
				
				if (!layout.gutter) {
					console.warn('Layout Gutter Value has not been set!')
					return ''
				}

				return layout.gutter
			}),

			getLayoutMinWidth: NGN.const(() => {
				const layout = this.settings.layout
				
				console.log(layout);
				
				if (!layout.minWidth) {
					console.warn('Layout Minimum Width Value has not been set!')
					return ''
				}

				return `${layout.minWidth}px`
			}),

			getLayoutMaxWidth: NGN.const(() => {
				const layout = this.settings.layout
				
				if (!layout.maxWidth) {
					console.warn('Layout Maximum Width Value has not been set!')
					return ''
				}

				return `${layout.maxWidth}px`
			}),

			getViewportWidthBound: NGN.const((name, bound) => {
				const viewportWidthRanges = this.settings.viewportWidthRanges
				
				const range = viewportWidthRanges.filter(vwr => {
					return name === vwr.name
				})

				if ( !range ) {
					console.warn(`Viewport Width Range ${name} does not exist.`)
					return ''
				}

				return `${range[bound]}px`
			}),
			
			getMediaQueryValue: NGN.privateconst((type, name) => {
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
			
			getViewportWidthRangesList: NGN.privateconst(() => {
				return this.settings.viewportWidthRanges.map(range => {
					return range.name
				})
			}),
			
			getViewportWidthRangeName: NGN.privateconst(index => {
				console.log(index);
				// return this.viewportWidthRanges[index].name
			}),
			
			getNumViewportWidthRanges: NGN.privateconst(() => {
				return this.settings.viewportWidthRanges.length
			}),

			getUnit: NGN.const(value => {
				return value.match(/\D+$/)[0]
			}),

			warn: NGN.const(message => {
				console.warn(message)
			})
		})

		this.layout = cfg.hasOwnProperty('layout') ? this.constructLayoutConfig(cfg.layout) : this.defaults.layout
		this.typography = cfg.hasOwnProperty('typography') ? this.constructTypographyConfig(cfg.typography) : this.defaults.typography
		this.viewportWidthRanges = cfg.hasOwnProperty('viewportWidthRanges') ? this.constructViewportWidthRangesConfig(cfg.viewportWidthRanges) : this.defaults.viewportWidthRanges
		this.zIndex = cfg.hasOwnProperty('zIndex') ? this.constructZIndexConfig(cfg.zIndex) : this.defaults.zIndex
		
	}
}

module.exports = ChassisProject
