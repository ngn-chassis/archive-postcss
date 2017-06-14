class ChassisAtRules {
	constructor (chassis) {
		this.chassis = chassis

		this.mixins = {
			'constrain-width': this.constrainWidth.bind(this),
			'disable-text-selection': this.disableTextSelection.bind(this),
			'ellipsis': this.ellipsis.bind(this),
			'ie-only': this.ieOnly.bind(this),
			'viewport-width': this.viewportWidth.bind(this),
			'viewport-height': this.viewportHeight.bind(this),
			'z-index': this.zIndex.bind(this)
		}
	}
	
	/**
	 * @mixin constrainWidth
	 * @return {array} of decls
	 */
	constrainWidth () {
		let { layout, settings, utils } = this.chassis
		let { minWidth, maxWidth, gutter } = settings.layout
		let { args } = this.cfg
		let parent = this.atRule.parent
		
		if (args && args.length > 0) {
			args.forEach((arg) => {
				if (arg.startsWith('min')) {
					minWidth = utils.string.stripParentheses(arg.replace('min', ''))
				} else if (arg.startsWith('max')) {
					maxWidth = utils.string.stripParentheses(arg.replace('max', ''))
				} else if (arg.startsWith('gutter')) {
					gutter = utils.string.stripParentheses(arg.replace('gutter', ''))
				}
			})
		}
		
		let decls = [
			utils.css.newDecl('width', '100%'),
			utils.css.newDecl('min-width', `${minWidth}px`),
			utils.css.newDecl('max-width', `${maxWidth}px`),
			utils.css.newDecl('margin', '0 auto')
		]
		
		if (parseInt(gutter) !== 0) {
			decls = [
				...decls,
				utils.css.newDecl('padding-left', gutter),
				utils.css.newDecl('padding-right', gutter)
			]
		
			this.root.insertAfter(this.atRule.parent, utils.css.newAtRule({
				name: 'media',
				params: `screen and (max-width: ${minWidth}px)`,
				nodes: [
					utils.css.newRule(this.atRule.parent.selector, [
						utils.css.newDeclObj('padding-left', layout.getGutterLimit(minWidth)),
						utils.css.newDeclObj('padding-right', layout.getGutterLimit(minWidth))
					])
				]
			}))
		
			this.root.insertAfter(this.atRule.parent, utils.css.newAtRule({
				name: 'media',
				params: `screen and (min-width: ${maxWidth}px)`,
				nodes: [
					utils.css.newRule(this.atRule.parent.selector, [
						utils.css.newDeclObj('padding-left', layout.getGutterLimit(maxWidth)),
						utils.css.newDeclObj('padding-right', layout.getGutterLimit(maxWidth))
					])
				]
			}))
		}
		
		this.atRule.replaceWith(decls)
	}

	/**
	 * @mixin disableTextSelection
	 * Disable users' ability to select a text node
	 */
	disableTextSelection () {
		let { utils } = this.chassis

		this.atRule.replaceWith([
      utils.css.newDecl('-webkit-touch-callout', 'none'),
      utils.css.newDecl('-webkit-user-select', 'none'),
      utils.css.newDecl('-khtml-user-select', 'none'),
			utils.css.newDecl('-moz-user-select', 'none'),
      utils.css.newDecl('-ms-user-select', 'none'),
      utils.css.newDecl('-o-user-select', 'none'),
			utils.css.newDecl('user-select', 'none')
    ])
	}

	/**
	 * @mixin ellipsis
	 */
  ellipsis () {
		let { utils } = this.chassis

		this.atRule.replaceWith([
      utils.css.newDecl('white-space', 'nowrap'),
      utils.css.newDecl('overflow', 'hidden'),
      utils.css.newDecl('text-overflow', 'ellipsis')
    ])
  }

	/**
   * @mixin ieOnly
   * TODO: Implement version support
   */
  ieOnly () {
		let { utils } = this.chassis

		this.atRule.replaceWith(utils.css.newAtRule({
      name: 'media',
      params: 'all and (-ms-high-contrast: none)',
      nodes: this.nodes.map((rule) => {
        rule.selector = `*::-ms-backdrop, ${rule.selector}`
        return rule
      })
    }))
  }

	viewportWidth () {
		let { layout, settings, utils } = this.chassis

		let operator = this.cfg.args[0]
		let width = parseInt(this.cfg.args[1])

		let mediaQuery = utils.css.newMediaQuery(
			layout.getMediaQueryParams('width', operator, width),
			this.nodes
		)

		this.atRule.replaceWith(mediaQuery)
	}

	viewportHeight () {
		let { layout, settings, utils } = this.chassis

		let operator = this.cfg.args[0]
		let height = parseInt(this.cfg.args[1])

		let mediaQuery = utils.css.newMediaQuery(
			layout.getMediaQueryParams('height', operator, height),
			this.nodes
		)

		this.atRule.replaceWith(mediaQuery)
	}

	/**
   * @mixin zIndex
   * Get calculated z-index value from project settings
   */
  zIndex () {
		let { settings, utils } = this.chassis
    let index = settings.zIndex[this.cfg.args[0]]

    if (!index) {
      console.error(`[ERROR] Chassis z-index: Invalid identifier. Accepted values: ${Object.keys(settings.zIndex).join(', ')}`)
    }

    this.atRule.replaceWith(utils.css.newDecl('z-index', index))
  }

	process (root, atRule, data) {
		this.root = root
		this.atRule = atRule

		for (let property in data) {
			this[property] = data[property]
		}

		if (this.mixins.hasOwnProperty(data.mixin)) {
			this.mixins[data.mixin]()
			return
		}

		console.error(`Chassis stylesheet line ${data.source.line}, column ${data.source.column}: Mixin "${data.mixin}" not found.`)
	}
}

module.exports = ChassisAtRules
