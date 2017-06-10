class ChassisConstants {
	static get typography () {
		return {
			breakpoints: (() => {
				let breakpoints = []

				for (let width = this.layout.viewport.minWidth; width <= this.layout.viewport.maxWidth; width += this.layout.viewport.widthIncrement) {
					breakpoints.push(width)
				}

				return breakpoints
			})(),
			scale: {
				ratios: {
					minorSecond: 1.067,
					majorSecond: 1.125,
					minorThird: 1.2,
					majorThird: 1.25,
					perfectFourth: 4 / 3,
					tritone: 1.414,
					perfectFifth: 1.5,
					goldenRatio: 1.61803398875
				},
				threshold: 640 // The viewport width above which font size should start to increment from base
			},
			sizeAliases: ['small', 'root', 'large', 'larger', 'largest']
		}
	}

	static get layout () {
		return {
			viewport: {
				minWidth: 0,
				maxWidth: 7680, // Up to 8k displays supported
				widthIncrement: 320
			},
			mediaQueries: {
				operators: ['<', '<=', '=', '>=', '>']
			}
		}
	}
}

module.exports = ChassisConstants
