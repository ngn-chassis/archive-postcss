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

		let { args } = this.cfg
		let stripPadding = NGN.coalesce(args && args.includes('no-padding'), false)
		let parent = this.atRule.parent

		this.root.insertAfter(this.atRule.parent, utils.newAtRule({
			name: 'media',
			params: `screen and (max-width: ${settings.layout.minWidth}px)`,
			nodes: [
				utils.newRule(this.atRule.parent.selector, [
					utils.newDeclObj('padding-left', layout.minGutterWidth),
					utils.newDeclObj('padding-right', layout.minGutterWidth)
				])
			]
		}))

		this.root.insertAfter(this.atRule.parent, utils.newAtRule({
			name: 'media',
			params: `screen and (min-width: ${settings.layout.maxWidth}px)`,
			nodes: [
				utils.newRule(this.atRule.parent.selector, [
					utils.newDeclObj('padding-left', layout.maxGutterWidth),
					utils.newDeclObj('padding-right', layout.maxGutterWidth)
				])
			]
		}))

		let decls = [
			utils.newDecl('width', '100%'),
			utils.newDecl('min-width', `${settings.layout.minWidth}px`),
			utils.newDecl('max-width', `${settings.layout.maxWidth}px`),
			utils.newDecl('margin', '0 auto')
		]

		if (!stripPadding) {
			decls = [
				...decls,
				utils.newDecl('padding-left', settings.layout.gutter),
				utils.newDecl('padding-right', settings.layout.gutter)
			]
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
      utils.newDecl('-webkit-touch-callout', 'none'),
      utils.newDecl('-webkit-user-select', 'none'),
      utils.newDecl('-khtml-user-select', 'none'),
			utils.newDecl('-moz-user-select', 'none'),
      utils.newDecl('-ms-user-select', 'none'),
      utils.newDecl('-o-user-select', 'none'),
			utils.newDecl('user-select', 'none')
    ])
	}

	/**
	 * @mixin ellipsis
	 */
  ellipsis () {
		let { utils } = this.chassis

		this.atRule.replaceWith([
      utils.newDecl('white-space', 'nowrap'),
      utils.newDecl('overflow', 'hidden'),
      utils.newDecl('text-overflow', 'ellipsis')
    ])
  }

	/**
   * @mixin ieOnly
   * TODO: Implement version support
   */
  ieOnly () {
		let { utils } = this.chassis

		this.atRule.replaceWith(utils.newAtRule({
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

		let mediaQuery = utils.newMediaQuery(
			layout.getMediaQueryParams('width', operator, width),
			this.nodes
		)

		this.atRule.replaceWith(mediaQuery)
	}

	viewportHeight () {
		let { layout, settings, utils } = this.chassis

		let operator = this.cfg.args[0]
		let height = parseInt(this.cfg.args[1])

		let mediaQuery = utils.newMediaQuery(
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

    this.atRule.replaceWith(utils.newDecl('z-index', index))
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
