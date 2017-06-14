class ChassisViewport {
	constructor (chassis) {
		this.chassis = chassis
	}
	
	getWidthRanges (string) {
		let { settings } = this.chassis
		
		let spec = string.split(' ').map((entry) => isNaN(parseInt(entry)) ? entry : parseInt(entry))
		
		let firstEntry = spec[0]
		let lastEntry = spec[spec.length - 1]
		
		if (typeof firstEntry === 'string') {
			spec.unshift(0)
		}
		
		if (typeof firstEntry === 'number' && firstEntry !== 0) {
			spec = [0, 'min', ...spec]
		}
		
		if (typeof lastEntry === 'number') {
			spec.push('max')
		}
		
		let vwrs = []
		
		for (let i = 0; i < spec.length; i += 2) {
			vwrs.push({
				name: spec[i + 1],
				lowerBound: spec[i],
				upperBound: spec[i + 2] || settings.layout.maxWidth
			})
		}
		
		return vwrs
	}
}

module.exports = ChassisViewport
