const ChassisProject = require('./project')
const ChassisUtils = require('../utilities')

class ChassisMixins {
	constructor (project) {
		this.project = project
	}

	_listPropertyValues (array) {
    return array.map(value => value === 0 ? 0 : `${value}em`).join(' ')
  }

  blockLayout (args) {
		let alias = 'root'
		let stripMargin = NGN.coalesce(args && args.includes('no-margin'), false)
		let stripPadding = NGN.coalesce(args && args.includes('no-padding'), false)
    let stripHorizontalPadding = NGN.coalesce(args && args.includes('no-horizontal-padding'), false)
    let stripVerticalPadding = NGN.coalesce(args && args.includes('no-vertical-padding'), false)

		let css = []

		this.project.viewport.widthRanges.forEach((range, index) => {
			let fontSize = this.project.typography.getFontSize(alias, range.upperBound, true)
			let lineHeight = this.project.typography.getLineHeight(alias, range.upperBound)

			let margin = `0 0 ${lineHeight}em 0`
			let padding = [(lineHeight / this.project.typography.typeScaleRatio) / 2, 1]

			if (stripVerticalPadding) {
				padding[0] = 0
			}

			if (stripHorizontalPadding) {
				padding[1] = 0
			}

			if (index === 0) {
				if (!stripMargin) {
					css.push(ChassisUtils.newDecl('margin', margin))
				}

				if (!stripPadding) {
					css.push(ChassisUtils.newDecl(
            'padding',
            this._listPropertyValues(padding)
          ))
				}
			} else {
				let nodes = []

				if (!stripMargin) {
					nodes.push(ChassisUtils.newDecl('margin', margin))
				}

				if (!stripPadding) {
					nodes.push(ChassisUtils.newDecl(
            'padding',
            this._listPropertyValues(padding)
          ))
				}

				css.push(this.project.viewport.getMediaQuery('min', range.name, nodes))
			}
		})

		return css
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

	disableTextSelection () {
		return ChassisUtils.parseStylesheet('stylesheets/mixins/disable-text-selection.css')
	}

  ellipsis () {
    return [
      ChassisUtils.newDecl('white-space', 'nowrap'),
      ChassisUtils.newDecl('overflow', 'hidden'),
      ChassisUtils.newDecl('text-overflow', 'ellipsis')
    ]
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

  /**
   * @mixin hide
   * Hide element
   * Sets the following properties:
   * display: none;
   * visibility: hidden;
   * opacity: 0;
   * @return {decls}
   */
  hide () {
    return [
      ChassisUtils.newDecl('display', 'none'),
      ChassisUtils.newDecl('visibility', 'hidden'),
      ChassisUtils.newDecl('opacity', '0')
    ]
  }

  /**
   * @mixin ieOnly
   * @param  {object} line
   * Line and column at which mixin was called
   * @param  {array} nodes
   * ie-specific rules
   * @param  {number} version
   * Earliest version of IE to support
   * TODO: Implement version support
   * @return {CSS}
   */
  ieOnly (line, rules, version = 11) {
    return ChassisUtils.newAtRule({
      name: 'media',
      params: 'all and (-ms-high-contrast: none)',
      nodes: rules.map(rule => {
        rule.selector = `*::-ms-backdrop, ${rule.selector}`
        return rule
      })
    })
  }

	/**
   * @mixin init
   * Generate core stylesheet from user configuration
   * @return {AST}
   */
  init () {
    return this.project.coreStyles
  }

  inlineLayout (args) {
		let alias = 'root'
		let stripPadding = NGN.coalesce(args && args.includes('no-padding'), false)
		let stripMargin = NGN.coalesce(args && args.includes('no-margin'), false)
		let stripHorizontalMargin = NGN.coalesce(args && args.includes('no-horizontal-margin'), false)
    let stripVerticalMargin = NGN.coalesce(args && args.includes('no-vertical-margin'), false)

		let multiLine = NGN.coalesce(args && args.includes('multi-line'), false)
		let setHeight = NGN.coalesce(args && args.includes('set-height'), false)
		
		let stripLineHeight = NGN.coalesce(args && args.includes('no-line-height'), false)

		let css = []

		this.project.viewport.widthRanges.forEach((range, index) => {
			let fontSize = this.project.typography.getFontSize(alias, range.upperBound, true)
      let baseLineHeight = this.project.typography.getLineHeight(alias, range.upperBound)

			let margin = [0, baseLineHeight / 2, baseLineHeight, 0]

			if (stripVerticalMargin) {
				margin[2] = 0
			}

			if (stripHorizontalMargin) {
				margin[1] = 0
			}

			let padding = [0, baseLineHeight / 2]

			if (multiLine) {
				padding[0] = ((baseLineHeight * this.project.typography.typeScaleRatio) - baseLineHeight) / 2
			}

			if (index === 0) {
				if (setHeight) {
					if (multiline) {
						css.push(ChassisUtils.newDecl(
              'height',
              `${baseLineHeight}em`
            ))
					} else {
						css.push(ChassisUtils.newDecl(
              'height',
              `${baseLineHeight * this.project.typography.typeScaleRatio}em`
            ))
					}
				}

				if (!stripPadding) {
          css.push(ChassisUtils.newDecl(
            'padding',
            this._listPropertyValues(padding)
          ))
        }

				if (!stripMargin) {
          css.push(ChassisUtils.newDecl(
            'margin',
            this._listPropertyValues(margin)
          ))
        }

				if (multiLine) {
          css.push(ChassisUtils.newDecl(
            'line-height',
            `${baseLineHeight}em`
          ))
        } else if (!stripLineHeight) {
          css.push(ChassisUtils.newDecl(
            'line-height',
            `${baseLineHeight * this.project.typography.typeScaleRatio}em`
          ))
        }
			} else {
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
              `${baseLineHeight * this.project.typography.typeScaleRatio}em`
            ))
					}
				}

				if (!stripPadding) {
          nodes.push(ChassisUtils.newDecl(
            'padding',
            this._listPropertyValues(padding)
          ))
        }

				if (!stripMargin) {
          nodes.push(ChassisUtils.newDecl(
            'margin',
            this._listPropertyValues(margin)
          ))
        }

				if (multiLine) {
          nodes.push(ChassisUtils.newDecl(
            'line-height',
            `${baseLineHeight}em`
          ))
        } else {
          nodes.push(ChassisUtils.newDecl(
            'line-height',
            `${baseLineHeight * this.project.typography.typeScaleRatio}em`
          ))
        }

				css.push(this.project.viewport.getMediaQuery('min', range.name, nodes))
			}
		})

		return css
  }

	lineHeight (selector, args) {
    let alias = NGN.coalesce(args, 'root')

		return this.project.viewport.widthRanges.map((range, index) => {
			let type = 'at'
			let lineHeight = this.project.typography.getLineHeight(alias, range.upperBound)

			let output = [ChassisUtils.newRule(selector, [
				ChassisUtils.newDeclObj('line-height', `${lineHeight}em`)
			])]

			if (index === 0) {
				type = 'max'
			} else if (index === this.project.viewport.widthRanges.length - 1) {
				type = 'min'
			}

			return this.project.viewport.getMediaQuery(type, range.name, output)
		})
  }

  /**
   * @mixin mediaQuery
   * @param  {object} line
   * Line and column at which mixin was called
   * @param  {object} config
   * media query params. Shape: {name: {string}, params: {string}, nodes: {array}}
   * @param  {array} nodes
   * rules to add inside media query
   * @return {CSS}
   */
  mediaQuery (line, config, nodes) {
    let type = config[0]
    let viewport = config[1]

    if (!this.project.viewport.validateMediaQuery(line, type, viewport)) {
      return
    }

    let dimension = NGN.coalesce(config[2], 'width')

    return this.project.viewport.getMediaQuery(type, viewport, nodes, dimension)
  }

  setTypography (selector, args) {
		let alias = NGN.coalesce(args.find(arg => ['root', 'small', 'large', 'larger', 'largest'].includes(arg)), 'root')
		let multiplier = NGN.coalesce(args.find(arg => typeof arg === 'number'), 1)
		let addMargin = NGN.coalesce(args.includes('add-margin'), false)

		return this.project.viewport.widthRanges.map((range, index) => {
			let type = 'at'
			let fontSize = this.project.typography.getFontSize(alias, range.upperBound) * multiplier
			let lineHeight = this.project.typography.getLineHeight(alias, range.upperBound) * multiplier

			let output = [ChassisUtils.newRule(selector, [
				ChassisUtils.newDeclObj('font-size', `${fontSize}px`),
				ChassisUtils.newDeclObj('line-height', `${lineHeight}em`)
			])]

			if (addMargin) {
				output[0].append(ChassisUtils.newDecl('margin-bottom', `${this.project.typography.getCalculatedMargin(alias, range.upperBound)}em`))
			}

			if (index === 0) {
				type = 'max'
			} else if (index === this.project.viewport.widthRanges.length - 1) {
        type = 'min'
      }

			return this.project.viewport.getMediaQuery(type, range.name, output)
		})
  }

  /**
   * @mixin show
   * Show element
   * Sets the following properties:
   * display: {string};
   * visibility: visible;
   * opacity: 1;
   * @param {array} args
   * Accepts CSS box model property values
   * @return {decls}
   */
  show (args) {
    let boxModel = NGN.coalesce(args && args[0], 'block')
    // TODO: Handle invalid box-model values

    return [
      ChassisUtils.newDecl('display', boxModel),
      ChassisUtils.newDecl('visibility', 'visible'),
      ChassisUtils.newDecl('opacity', '1')
    ]
  }

  /**
   * @mixin z-index
   * @param  {array} args
   * arguments passed to mixin
   * @return {decl}
   */
  zIndex (args) {
    let index = this.project.settings.zIndex[args[0]]

    if (!index) {
      console.error(`[ERROR] Chassis z-index: Invalid identifier. Accepted values: ${Object.keys(this.project.settings.zIndex).join(', ')}`)
    }

    return ChassisUtils.newDecl('z-index', index)
  }
}

module.exports = ChassisMixins
