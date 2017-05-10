const ChassisUtils = require('../utilities')

class ChassisLayoutMixins {
	constructor (project) {
		this.project = project
	}
	
	/**
   * @mixin constrainWidth
   * @param  {object}  line
   * Line and column at which mixin was called
   * @param  {Boolean} [hasPadding=true]
   * Whether or not to add layout gutter to left and right
   * @return {array} of decls
   */
  constrainWidth (hasPadding = true) {
    let decls = [
      ChassisUtils.newDecl('width', '100%'),
      ChassisUtils.newDecl('min-width', `${this.project.layout.minWidth}px`),
      ChassisUtils.newDecl('max-width', `${this.project.layout.maxWidth}px`),
      ChassisUtils.newDecl('margin', '0 auto')
    ]

    if (hasPadding) {
      decls = [
        ...decls,
        ChassisUtils.newDecl('padding-left', this.project.layout.gutter),
        ChassisUtils.newDecl('padding-right', this.project.layout.gutter)
      ]
    }

    return decls
  }
	
	block (args) {
		let { typography, viewport } = this.project
		
		let alias = 'root'
		let stripMargin = this._coalesceProperty(args, 'no-margin')
		let stripPadding = this._coalesceProperty(args, 'no-padding')
    let stripHorizontalPadding = this._coalesceProperty(args, 'no-horizontal-padding')
    let stripVerticalPadding = this._coalesceProperty(args, 'no-vertical-padding')

		let css = []

		viewport.widthRanges.forEach((range, index) => {
			let fontSize = typography.getFontSize(alias, range.upperBound, true)
			let lineHeight = typography.getLineHeight(alias, range.upperBound)

			let margin = `0 0 ${lineHeight}em 0`
			let padding = [(lineHeight / typography.typeScaleRatio) / 2, 1]

			let queryType = 'max'

			if (stripVerticalPadding) {
				padding[0] = 0
			}

			if (stripHorizontalPadding) {
				padding[1] = 0
			}

			let nodes = []

			if (!stripMargin) {
				nodes.push(ChassisUtils.newDecl('margin', margin))
			}

			if (!stripPadding) {
				nodes.push(ChassisUtils.newDecl(
					'padding',
					ChassisUtils.listPropertyValues(padding)
				))
			}

			if (index === 0) {
				queryType = 'min'
			}

			css.push(viewport.getMediaQuery(queryType, range.name, nodes))
		})

		return css
  }

  inline (args) {
		let { layout, typography, viewport } = this.project

		let alias = 'root'
		let stripPadding = this._coalesceProperty(args, 'no-padding')
		let stripMargin = this._coalesceProperty(args, 'no-margin')
		let stripHorizontalMargin = this._coalesceProperty(args, 'no-horizontal-margin')
    let stripVerticalMargin = this._coalesceProperty(args, 'no-vertical-margin')
		let multiLine = this._coalesceProperty(args, 'multi-line')
		let setHeight = this._coalesceProperty(args, 'set-height')
		let stripLineHeight = this._coalesceProperty(args, 'no-line-height')

		let css = []

		viewport.widthRanges.forEach((range, index) => {
			let fontSize = typography.getFontSize(alias, range.upperBound, true)
      let baseLineHeight = typography.getLineHeight(alias, range.upperBound)
			let finalHeight = layout.getInlineHeight(baseLineHeight)
			let margin = [0, baseLineHeight / 2, baseLineHeight, 0]
			let queryType = 'min'

			if (stripVerticalMargin) {
				margin[2] = 0
			}

			if (stripHorizontalMargin) {
				margin[1] = 0
			}

			let padding = [0, baseLineHeight / 2]

			if (multiLine) {
				padding[0] = (finalHeight - baseLineHeight) / 2
			}

			let nodes = []

			if (setHeight) {
				if (multiline) {
					nodes.push(ChassisUtils.newDecl(
						'height',
						`${baseLineHeight}em`
					))
				} else {
					nodes.push(ChassisUtils.newDecl(
						'height',
						`${finalHeight}em`
					))
				}
			}

			if (!stripPadding) {
				nodes.push(ChassisUtils.newDecl(
					'padding',
					ChassisUtils.listPropertyValues(padding)
				))
			}

			if (!stripMargin) {
				nodes.push(ChassisUtils.newDecl(
					'margin',
					ChassisUtils.listPropertyValues(margin)
				))
			}

			if (!stripLineHeight) {
				if (multiLine) {
					nodes.push(ChassisUtils.newDecl(
						'line-height',
						`${baseLineHeight}em`
					))
				} else {
					nodes.push(ChassisUtils.newDecl(
						'line-height',
						`${finalHeight}em`
					))
				}
			}

			if (index === 0) {
				queryType = 'max'
			}

			css.push(viewport.getMediaQuery(queryType, range.name, nodes))
		})

		return css
  }
	
	_coalesceProperty (config, property, fallback = false) {
		return NGN.coalesce(config && config.includes(property), fallback)
	}
}

module.exports = ChassisLayoutMixins
