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
				if (!this.layout.gutter) {
					console.warn('Layout Gutter Value has not been set!')
					return ''
				}

				return this.layout.gutter
			}),

			getLayoutMinWidth: NGN.const(() => {
				if (!this.layout.minWidth) {
					console.warn('Layout Minimum Width Value has not been set!')
					return ''
				}

				return `${this.layout.minWidth}px`
			}),

			getLayoutMaxWidth: NGN.const(() => {
				if (!this.layout.maxWidth) {
					console.warn('Layout Maximum Width Value has not been set!')
					return ''
				}

				return `${this.layout.maxWidth}px`
			}),

			getViewportWidthBound: NGN.const((name, bound) => {
				const range = this.viewportWidthRanges.filter(vwr => {
					return name === vwr.name
				})

				if ( !range ) {
					console.warn(`Viewport Width Range ${name} does not exist.`)
					return ''
				}

				return `${range[bound]}px`
			}),
			
			getMediaQueryValue: NGN.privateconst((type, name) => {
				let index = 0;
				
				const range = this.viewportWidthRanges.filter((vwr, i) => {
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
						return index === this.viewportWidthRanges.length ? `${range.upperBound}px` : `${range.upperBound - 1}px`
						break						
						
					case 'min':
						return `${range.lowerBound}px`
						break	
						
					case 'above':
						return `${range.upperBound + 1}px`
						break	
				}
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
