class ChassisConstants {
	static get minorSecond () {
		return 1.067
	}

	static get majorSecond () {
		return 1.125
	}

	static get minorThird () {
		return 1.2
	}

	static get majorThird () {
		return 1.25
	}

	static get perfectFourth () {
		return 4 / 3
	}

	static get tritone () {
		return 1.414
	}

	static get perfectFifth () {
		return 1.5
	}

	static get goldenRatio () {
		return 1.61803398875
	}
	
	// The viewport width above which font size should start to grow above root
	static get typeScalePoint () {
		return 640
	}
	
	static get minViewportWidth () {
		return 0
	}
	
	static get maxViewportWidth () {
		return 7680 // Up to 8k displays supported
	}
	
	static get viewportWidthIncrement () {
		return 320
	}
	
	static get typographyBreakpoints () {
		let breakpoints = []
		
		for (let width = this.minViewportWidth; width <= this.maxViewportWidth; width += this.viewportWidthIncrement) {
			breakpoints.push(width)
		}
		
		return breakpoints
	}
}

module.exports = ChassisConstants
