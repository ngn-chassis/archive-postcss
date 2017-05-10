const ChassisUtils = require('../utilities')

class ChassisTypographyMixins {
	constructor (project) {
		this.project = project
	}

  fontSize (selector, args) {
    let alias = NGN.coalesce(args, 'root')

		return this.project.viewport.widthRanges.map((range, index) => {
			let type = 'at'
			let fontSize = this.project.typography.getFontSize(alias, range.upperBound)

			let output = [ChassisUtils.newRule(selector, [
				ChassisUtils.newDeclObj('font-size', `${fontSize}px`)
			])]

			if (index === 0) {
				type = 'max'
			} else if (index === this.project.viewport.widthRanges.length - 1) {
				type = 'min'
			}

			return this.project.viewport.getMediaQuery(type, range.name, output)
		})
  }

	fontWeight (atRule, line, args) {
    // TODO: Add error handling
    let fontWeightAlias = args[0]
    return ChassisUtils.newDecl('font-weight', this.project.typography.getFontWeight(line, fontWeightAlias))
  }
	
	lineHeight (selector, args) {
		let { typography, viewport } = this.project
    let alias = NGN.coalesce(args, 'root')

		return viewport.widthRanges.map((range, index) => {
			let type = 'at'
			let lineHeight = typography.getLineHeight(alias, range.upperBound)

			let output = [ChassisUtils.newRule(selector, [
				ChassisUtils.newDeclObj('line-height', `${lineHeight}em`)
			])]

			if (index === 0) {
				type = 'max'
			} else if (index === viewport.widthRanges.length - 1) {
				type = 'min'
			}

			return viewport.getMediaQuery(type, range.name, output)
		})
  }
	
	define (selector, args) {
		let { typography, viewport } = this.project
		let alias = NGN.coalesce(args.find(arg => ['root', 'small', 'large', 'larger', 'largest'].includes(arg)), 'root')
		let multiplier = NGN.coalesce(args.find(arg => typeof arg === 'number'), 1)
		let addMargin = NGN.coalesce(args.includes('add-margin'), false)

		return viewport.widthRanges.map((range, index) => {
			let type = 'at'
			let fontSize = typography.getFontSize(alias, range.upperBound) * multiplier
			let lineHeight = typography.getLineHeight(alias, range.upperBound) * multiplier

			let output = [ChassisUtils.newRule(selector, [
				ChassisUtils.newDeclObj('font-size', `${fontSize}px`),
				ChassisUtils.newDeclObj('line-height', `${lineHeight}em`)
			])]

			if (addMargin) {
				output[0].append(ChassisUtils.newDecl(
					'margin-bottom',
					`${typography.getCalculatedMargin(alias, range.upperBound)}em`
				))
			}

			if (index === 0) {
				type = 'max'
			} else if (index === viewport.widthRanges.length - 1) {
        type = 'min'
      }

			return viewport.getMediaQuery(type, range.name, output)
		})
  }
}

module.exports = ChassisTypographyMixins
