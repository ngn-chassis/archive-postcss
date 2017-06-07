class ChassisAutoTypography {
	constructor (chassis) {
		this.chassis = chassis
		
		let { settings, constants } = chassis
		
		// this.cpl = 67
		this.scale = settings.typography.typeScaleRatio
		this.root = settings.typography.rootFontSize
		this.breakpoints = constants.typographyBreakpoints.filter((breakpoint) => {
			return breakpoint <= settings.layout.maxWidth
		})
		this.typeScalePoint = constants.typeScalePoint
		
		// console.log(JSON.stringify(this.ranges, null, 2));
	}
	
	getFontSize (alias, root = this.root) {
		switch (alias) {
			case '-1':
				return (root * (1 / Math.sqrt(this.scale)))
				break
				
			case 'root':
				return root
				break
				
			case '+1':
				return (root * Math.sqrt(this.scale))
				break
				
			case '+2':
				return (root * this.scale)
				break
				
			case '+3':
				return (root * Math.pow(this.scale, 2))
				break
				
			default:
				console.error(`[ERROR] Chassis Typography: Font Size Class "${alias}" not found. Defaulting to "root"`)
				return root
		}
	}

	getLineHeight (fontSize, viewportWidth, ratio = this.scale) {
		return (ratio - ((1 / (2 * ratio)) * (1 - (viewportWidth / this.getOptimalLineWidth(fontSize))))) * fontSize
	}

	getOptimalLineWidth (fontSize, ratio = this.scale) {
		return Math.pow(fontSize * ratio, 2)
	}
	
	getTypographyRules (vwr) {
		let averageViewportWidth = (vwr.bounds.lower + vwr.bounds.upper) / 2
		
		let fontSizes = {
			'-1': this.getFontSize('-1', vwr.rootFontSize),
			'root': vwr.rootFontSize,
			'+1': this.getFontSize('+1', vwr.rootFontSize),
			'+2': this.getFontSize('+2', vwr.rootFontSize),
			'+3': this.getFontSize('+3', vwr.rootFontSize)
		}
		
		return {
			'-1': {
				size: fontSizes['-1'],
				lineHeight: this.getLineHeight(fontSizes['-1'], averageViewportWidth)
			},
			'root': {
				size: fontSizes['root'],
				lineHeight: this.getLineHeight(fontSizes['root'], averageViewportWidth)
			},
			'+1': {
				size: fontSizes['+1'],
				lineHeight: this.getLineHeight(fontSizes['+1'], averageViewportWidth)
			},
			'+2': {
				size: fontSizes['+2'],
				lineHeight: this.getLineHeight(fontSizes['+2'], averageViewportWidth)
			},
			'+3': {
				size: fontSizes['+3'],
				lineHeight: this.getLineHeight(fontSizes['+3'], averageViewportWidth)
			}
		}
	}
	
	get ranges () {
		let rootFontSize = this.root
		
		return this.breakpoints.map((breakpoint, index) => {
			if (index === this.breakpoints.length - 1) {
				return
			}
			
			let bounds = {
				lower: breakpoint,
				upper: this.breakpoints[index + 1]
			}
			
			if (bounds.lower >= this.typeScalePoint) {
				rootFontSize++
			}
			
			return {
				bounds,
				typography: this.getTypographyRules({bounds, rootFontSize})
			}
		}).filter((vwr) => vwr !== undefined)
	}
}

module.exports = ChassisAutoTypography
