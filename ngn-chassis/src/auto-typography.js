class AutoTypography {
	constructor (chassis) {
		this.chassis = chassis
		
		// TODO: Get these values from config object / settings
		this.cpl = 67
		this.typeScaleRatio = 1.61803398875
		this.rootFontSize = 16 // Root for the whole project
		
		this.breakpoints = [320,512,768,1024,1366,1600,1920,2048,2560]
		
		console.log(JSON.stringify(this.viewportWidthRanges, null, 2));
	}
	
	getFontSize (alias, root = this.rootFontSize, multiplier = 1) {
		switch (alias) {
			case 'small':
				return (root * (1 / Math.sqrt(this.typeScaleRatio))) * multiplier
				break
				
			case 'large':
				return (root * Math.sqrt(this.typeScaleRatio)) * multiplier
				break
				
			case 'larger':
				return (root * this.typeScaleRatio) * multiplier
				break
				
			case 'largest':
				return (root * Math.pow(this.typeScaleRatio, 2)) * multiplier
				break
				
			default:
				return root
		}
	}

	getLineHeight (fontSize, upperBound, ratio = this.typeScaleRatio) {
		let optimalLineWidth = this.getOptimalLineWidth(fontSize)
		
		return (ratio - ((1 / (2 * ratio)) * (1 - (upperBound / optimalLineWidth)))) * fontSize
	}

	getOptimalLineWidth (fontSize, ratio = this.typeScaleRatio) {
		let optimalLineHeight = fontSize * ratio
		
		return Math.pow(optimalLineHeight, 2)
	}
	
	get viewportWidthRanges () {
		return this.breakpoints.map((breakpoint, index) => {
			let root = this.rootFontSize + index
			
			let small = this.getFontSize('small', root)
			let large = this.getFontSize('large', root)
			let larger = this.getFontSize('larger', root)
			let largest = this.getFontSize('largest', root)
			
			let lower = breakpoint
			let upper = this.breakpoints[index + 1] || breakpoint + 320
			let average = (lower + upper) / 2
			
			return {
				bounds: {lower, upper},
				typography: {
					root: {
						size: root / root,
						lineHeight: this.getLineHeight(root, average) / root
					},
					small: {
						size: small / root,
						lineHeight: this.getLineHeight(small, upper) / root
					},
					large: {
						size: large / root,
						lineHeight: this.getLineHeight(large, upper) / root
					},
					larger: {
						size: larger / root,
						lineHeight: this.getLineHeight(larger, upper) / root
					},
					largest: {
						size: largest / root,
						lineHeight: this.getLineHeight(largest, upper) / root
					}
				}
			}
		})
	}
}

module.exports = AutoTypography
