'use strict'

require('ngn')

class ChassisProject extends NGN.EventEmitter {
	constructor(cfg) {

		cfg = cfg || {}

		super()

		const defaultMinWidth = '320px'
		const defaultMaxWidth = '1440px'

		Object.defineProperties(this, {
			defaults: NGN.privateconst({
				layout: {
					uiGutter: '6.18vw',
					uiMinWidth: defaultMinWidth,
					uiMaxWidth: defaultMaxWidth
				},
				viewportWidthRanges: {
					tiny: {
						lowerBound: defaultMinWidth,
						upperBound: '512px'
					},
					small: {
						lowerBound: '512px',
						upperBound: '768px'
					},
					medium: {
						lowerBound: '768px',
						upperBound: '1024px'
					},
					large: {
						lowerBound: '1024px',
						upperBound: '1200px'
					},
					huge: {
						lowerBound: '1200px',
						upperBound: defaultMaxWidth
					}
				}
			}),

			constructLayoutConfig: NGN.privateconst((custom) => {
				return {
					uiGutter: NGN.coalesce(custom.uiGutter, this.defaults.layout.uiGutter),
					uiMinWidth: NGN.coalesce(custom.uiMinWidth, this.defaults.layout.uiMinWidth),
					uiMaxWidth: NGN.coalesce(custom.uiMaxWidth, this.defaults.layout.uiMaxWidth),
					defaultBorderRadius: NGN.coalesce(custom.defaultBorderRadius, this.defaults.layout.defaultBorderRadius)
				}
			}),

			constructViewportWidthRangesConfig: NGN.privateconst((custom) => {
				const vwr = {}

				Object.keys(custom).forEach(key => {
					vwr[key] = custom[key]
				})

				return vwr
			}),

			getUiGutter: NGN.const(() => {
				if (this.layout.uiGutter) {
					return this.layout.uiGutter
				}

				console.warn('UI Gutter Value has not been set!')
				return ''
			}),

			getUiMinWidth: NGN.const(() => {
				if (this.layout.uiMinWidth) {
					return this.layout.uiMinWidth
				}

				console.warn('UI Minimum Width Value has not been set!')
				return ''
			}),

			getUiMaxWidth: NGN.const(() => {
				if (!this.layout.uiMaxWidth) {
					console.warn('UI Maximum Width Value has not been set!')
					return ''
				}

				return this.layout.uiMaxWidth
			}),

			getViewportWidthRange: NGN.const((name) => {
				const range = this.viewportWidthRanges[name]

				if ( !range ) {
					console.warn(`Viewport Width Range ${name} does not exist.`)
					return ''
				}

				return range
			}),

			getUnit: NGN.const(value => {
				return value.match(/\D+$/)[0]
			}),

			warn: NGN.const(message => {
				console.warn(message)
			})
		})

		this.layout = cfg.hasOwnProperty('layout') ? this.constructLayoutConfig(cfg.layout) : this.defaults.layout
		this.viewportWidthRanges = cfg.hasOwnProperty('viewportWidthRanges') ? this.constructViewportWidthRangesConfig(cfg.viewportWidthRanges) : this.defaults.viewportWidthRanges

	}
}

module.exports = ChassisProject
