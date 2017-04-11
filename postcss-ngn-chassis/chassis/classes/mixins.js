const ChassisProject = require('./project')
const ChassisUtils = require('../utilities')

class ChassisMixins {
	constructor (project) {
		this.project = project
	}

  blockLayout (args) {
    let config = {
      alias: 'root'
    }

    if (args) {
      let stripPadding = NGN.coalesce(args.includes('no-padding'), true)
      let stripHorizontalPadding = NGN.coalesce(args.includes('no-horizontal-padding'), true)
      let stripVerticalPadding = NGN.coalesce(args.includes('no-vertical-padding'), true)
      let stripMargin = NGN.coalesce(args.includes('no-margin'), false)

      if (stripHorizontalPadding) {
        config.stripHorizontalPadding = stripHorizontalPadding
      }

      if (stripVerticalPadding) {
        config.stripVerticalPadding = stripVerticalPadding
      }

      if (stripPadding || (stripHorizontalPadding && stripVerticalPadding)) {
        delete config.stripHorizontalPadding
        delete config.stripVerticalPadding
        config.stripPadding = true
      }

      if (stripMargin) {
        config.stripMargin = true
      }
    }

    return this.project.layout.getBlockElementProperties(config)
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

			if (index === 1) {
				type = 'max'
			} else if (index === this.project.viewport.widthRanges.length) {
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
   * @mixin generate
   * Generate core stylesheet from user configuration
   * @param  {object} line
   * Line and column at which mixin was called
   * @param  {array} args
   * additional params passed to mixin
   * @return {AST}
   */
  generate (line, args) {
    // console.log(args);
    return this.project.coreStyles
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

  inlineLayout (rule, line, args) {
    let config = {
      alias: 'root'
    }

    if (args) {
      let stripMargin = NGN.coalesce(args.includes('no-margin'), true)
      let stripHorizontalMargin = NGN.coalesce(args.includes('no-horizontal-margin'), true)
      let stripVerticalMargin = NGN.coalesce(args.includes('no-vertical-margin'), true)

      let stripPadding = NGN.coalesce(args.includes('no-padding'), false)

      let multiLine = NGN.coalesce(args.includes('multi-line'), false)

      let setHeight = NGN.coalesce(args.includes('set-height'), false)

      if (stripHorizontalMargin) {
        config.stripHorizontalMargin = stripHorizontalMargin
      }

      if (stripVerticalMargin) {
        config.stripVerticalMargin = stripVerticalMargin
      }

      if (stripMargin || (stripHorizontalMargin && stripVerticalMargin)) {
        delete config.stripHorizontalMargin
        delete config.stripVerticalMargin
        config.stripMargin = true
      }

      if (stripPadding) {
        config.stripPadding = true
      }

      if (multiLine) {
        config.multiLine = true
      }

      if (setHeight) {
        config.setHeight = true
      }
    }

    return this.project.layout.getInlineElementProperties(rule, line, config)
  }

	lineHeight (selector, args) {
    let alias = NGN.coalesce(args, 'root')

		return this.project.viewport.widthRanges.map((range, index) => {
			let type = 'at'
			let lineHeight = this.project.typography.getLineHeight(alias, range.upperBound)

			let output = [ChassisUtils.newRule(selector, [
				ChassisUtils.newDeclObj('line-height', `${lineHeight}em`)
			])]

			if (index === 1) {
				type = 'max'
			} else if (index === this.project.viewport.widthRanges.length) {
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

			if (index === 1) {
				type = 'max'
			} else if (index === this.project.viewport.widthRanges.length) {
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
  show (line, args) {
    let boxModel = NGN.coalesce(args, 'block')
    // TODO: Handle invalid box-model values

    return [
      ChassisUtils.newDecl('display', boxModel),
      ChassisUtils.newDecl('visibility', 'visible'),
      ChassisUtils.newDecl('opacity', '1')
    ]
  }

  /**
   * @mixin z-index
   * @param  {line} line
   * line where mixin was called
   * @param  {array} args
   * arguments passed to mixin
   * @return {decl}
   */
  zIndex (line, args) {
    let index = this.project.settings.zIndex[args[0]]

    if (!index) {
      console.error(`[ERROR] Chassis z-index: Invalid identifier. Accepted values: ${Object.keys(this.project.settings.zIndex).join(', ')}`)
    }

    return ChassisUtils.newDecl('z-index', index)
  }
}

module.exports = ChassisMixins
