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
					'minor second': 1.067,
					'major second': 1.125,
					'minor third': 1.2,
					'major third': 1.25,
					'perfect fourth': 4 / 3,
					'tritone': 1.414,
					'perfect fifth': 1.5,
					'golden ratio': 1.61803398875
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
