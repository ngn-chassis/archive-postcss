class AutoTypography {
	constructor (chassis) {
		this.chassis = chassis
		
		// TODO: Get these values from config object / settings
		this.cpl = 67
		this.typeScaleRatio = 1.618
		this.rootFontSize = 16 // Root for the whole project
		
		// TODO: decide whether these should be constants or should match
		// user-specified breakpoints
		this.viewportWidthRanges = [
			{
				lowerBound: 512,
				upperBound: 768
			},
			{
				lowerBound: 768,
				upperBound: 1024
			},
			{
				lowerBound: 1024,
				upperBound: 1200
			},
			{
				lowerBound: 1200,
				upperBound: 1440
			},
			{
				lowerBound: 1440,
				upperBound: 1600
			},
			{
				lowerBound: 1600,
				upperBound: 1920
			},
			{
				lowerBound: 1920,
				upperBound: 2048
			}
		]
		
		console.log(this.getCalculatedSizes());
	}
	
	calculateFontSize (alias, root = this.rootFontSize, multiplier = 1) {
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

	getCalculatedLineHeight (width, fontSize) {
		return Math.sqrt(width) / fontSize
	}

	getCalculatedLineWidth (lineHeight) {
		return Math.pow(optimalLineHeight, 2)
	}
	
	getCalculatedSizes () {
		return this.viewportWidthRanges.map((vwr, index) => {
			let root = this.rootFontSize + index
			
			return {
				root,
				small: this.calculateFontSize('small', root),
				large: this.calculateFontSize('large', root),
				larger: this.calculateFontSize('larger', root),
				largest: this.calculateFontSize('largest', root)
			}
		})
	}
}

module.exports = AutoTypography
