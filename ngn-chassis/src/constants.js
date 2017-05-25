class ChassisConstants {
	static get defaultMinWidth () {
		return 320
	}

	static get defaultMaxWidth () {
		return 1440
	}

	static get defaultViewportWidthRanges () {
		return [
			{
				name: 'tiny',
				lowerBound: ChassisConstants.defaultMinWidth,
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
				upperBound: ChassisConstants.defaultMaxWidth
			}
		]
	}

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

	static get goldenRatioTypographyRules () {
		return [
			// {
			//   lowerBound: 0,
			//   upperBound: 320,
			//   fontSizes: {
			//     root: 14,
			//     small: 11,
			//     large: 18,
			//     larger: 23,
			//     largest: 37
			//   }
			// },
			// {
			//   lowerBound: 320,
			//   upperBound: 512,
			//   fontSizes: {
			//     root: 15,
			//     small: 12,
			//     large: 19,
			//     larger: 24,
			//     largest: 39
			//   }
			// },
			{
				lowerBound: 0,
				upperBound: 320,
				fontSizes: {
					root: 16,
					small: 13,
					large: 20,
					larger: 26,
					largest: 42
				}
			},
			{
				lowerBound: 320,
				upperBound: 512,
				fontSizes: {
					root: 16,
					small: 13,
					large: 20,
					larger: 26,
					largest: 42
				}
			},
			{
				lowerBound: 512,
				upperBound: 768,
				fontSizes: {
					root: 16,
					small: 13,
					large: 20,
					larger: 26,
					largest: 42
				}
			},
			{
				lowerBound: 768,
				upperBound: 1024,
				fontSizes: {
					root: 17,
					small: 13,
					large: 22,
					larger: 28,
					largest: 45
				}
			},
			{
				lowerBound: 1024,
				upperBound: 1200,
				fontSizes: {
					root: 18,
					small: 14,
					large: 23,
					larger: 29,
					largest: 47
				}
			},
			{
				lowerBound: 1200,
				upperBound: 1440,
				fontSizes: {
					root: 19,
					small: 15,
					large: 24,
					larger: 31,
					largest: 50
				}
			},
			{
				lowerBound: 1440,
				upperBound: 1600,
				fontSizes: {
					root: 20,
					small: 16,
					large: 25,
					larger: 32,
					largest: 52
				}
			},
			{
				lowerBound: 1600,
				upperBound: 1920,
				fontSizes: {
					root: 21,
					small: 17,
					large: 27,
					larger: 34,
					largest: 55
				}
			},
			{
				lowerBound: 1920,
				upperBound: 2048,
				fontSizes: {
					root: 22,
					small: 17,
					large: 28,
					larger: 36,
					largest: 58
				}
			}
		]
	}
}

module.exports = ChassisConstants
