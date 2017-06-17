class ChassisViewportMixins {
  constructor (chassis) {
    this.chassis = chassis
  }

  height (root, atRule, data) {
		let { settings, utils, viewport } = this.chassis

		let operator = data.cfg.args[0]
		let height = parseInt(data.cfg.args[1])

		if (isNaN(height)) {
			console.error(`[ERROR] Line ${data.source.line}: Invalid viewport height value "${this.cfg.args[1]}".`)
			atRule.remove()
			return
		}

		let mediaQuery = utils.css.newMediaQuery(
			viewport.getMediaQueryParams('height', operator, height),
			data.nodes
		)

		atRule.replaceWith(mediaQuery)
	}

  width (root, atRule, data) {
    let { settings, utils, viewport } = this.chassis

		let operator = data.cfg.args[0]

		if (!viewport.operatorIsValid(operator)) {
			console.error(`[ERROR] Line ${data.source.line}: Invalid media query operator "${operator}".`)
			atRule.remove()
			return
		}

		let width = parseInt(data.cfg.args[1])
		let isRange = false

		if (isNaN(width)) {
			let name = data.cfg.args[1]

			width = settings.viewportWidthRanges.find({name})[0]

			if (!width) {
				console.error(`[ERROR] Line ${data.source.line}: Viewport Width Range "${this.cfg.args[1]}" not found.`)
				atRule.remove()
				return
			}

			isRange = true
		}

		if (operator === 'from') {
			let secondOperator = data.cfg.args[2]

			if (secondOperator !== undefined) {
				if (secondOperator !== 'to') {
					console.error(`[ERROR] Line ${data.source.line}: Invalid second media query operator "${secondOperator}". Please use "to" instead.`)
					atRule.remove()
					return
				}

				operator = '='

				let secondWidthValue = data.cfg.args[3]
				let secondWidthValueIsRange = false

				if (isNaN(secondWidthValue)) {
					secondWidthValue = settings.viewportWidthRanges.find({
						name: secondWidthValue
					})[0]

					if (!secondWidthValue) {
						console.error(`[ERROR] Line ${data.source.line}: Viewport Width Range "${this.cfg.args[3]}" not found.`)
						atRule.remove()
						return
					}

					secondWidthValueIsRange = true
				}

				if (secondWidthValue) {
					width = {
						name: 'custom',
						lowerBound: isRange ? width.lowerBound : width,
						upperBound: secondWidthValueIsRange ? secondWidthValue.upperBound : secondWidthValue
					}
				}
			}
		}

		let mediaQuery = utils.css.newMediaQuery(
			viewport.getMediaQueryParams('width', operator, width),
			data.nodes
		)

		atRule.replaceWith(mediaQuery)
  }
}

module.exports = ChassisViewportMixins
