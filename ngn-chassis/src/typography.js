class ChassisTypography {
	constructor (chassis) {
		this.chassis = chassis

		let { settings, constants } = chassis

		this.root = settings.typography.baseFontSize
		this.fontSizeAliases = constants.fontSizeAliases

		this.scale = {
			threshold: constants.typeScaleThreshold,
			ratio: settings.typography.scaleRatio
		}
	}

	get ranges () {
		let { constants, settings } = this.chassis
		let rootFontSize = this.root

		let breakpoints = constants.typographyBreakpoints.filter((breakpoint) => {
			return breakpoint <= settings.layout.maxWidth
		})

		return breakpoints.map((breakpoint, index) => {
			if (index === breakpoints.length - 1) {
				return
			}

			let bounds = {
				lower: breakpoint,
				upper: breakpoints[index + 1]
			}

			if (bounds.lower >= this.scale.threshold) {
				rootFontSize++
			}

			return {
				bounds,
				typography: this.getViewportSettings({bounds, rootFontSize})
			}
		}).filter((vwr) => vwr !== undefined)
	}

	calculateFontSize (alias, root = this.root) {
		if (alias === 'root') {
			return root
		}

		let multiplier = 1

		switch (alias) {
			case 'small':
				multiplier = 1 / Math.sqrt(this.scale.ratio)
				break

			case 'large':
				multiplier = Math.sqrt(this.scale.ratio)
				break

			case 'larger':
				multiplier = this.scale.ratio
				break

			case 'largest':
				multiplier = Math.pow(this.scale.ratio, 2)
				break

			default:
				console.error(`[ERROR] Chassis Auto-Typography: Font scale "${alias}" not found. Defaulting to root.`)
		}

		return root * multiplier
	}

	calculateLineHeight (fontSize, viewportWidth, ratio = this.scale.ratio) {
		return (ratio - 1 / (2 * ratio) * (1 - viewportWidth / this.calculateOptimalLineWidth(fontSize))) * fontSize
	}

	calculateOptimalLineWidth (fontSize, ratio = this.scale.ratio) {
		return Math.pow(fontSize * ratio, 2)
	}

	calculateMarginBottom (lineHeight, ratio = this.scale.ratio) {
    return lineHeight / ratio
	}

	getViewportSettings (vwr) {
		let averageViewportWidth = (vwr.bounds.lower + vwr.bounds.upper) / 2
		let rules = {}

		this.fontSizeAliases.forEach((alias) => {
			let fontSize = this.calculateFontSize(alias, vwr.rootFontSize)

			rules[alias] = {
				fontSize,
				lineHeight: this.calculateLineHeight(fontSize, averageViewportWidth)
			}
		})

		return rules
	}
}

module.exports = ChassisTypography
