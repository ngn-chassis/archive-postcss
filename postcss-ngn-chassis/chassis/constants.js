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

	static get stylesheets () {
		return [
      'stylesheets/reset.css',
      'stylesheets/global-modifiers.css',
      'stylesheets/copic-greys.css'
    ]
	}
}

module.exports = ChassisConstants
