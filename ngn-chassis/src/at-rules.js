class ChassisAtRules {
	constructor (chassis) {
		this.chassis = chassis

		this.mixins = {
			'constrain-width': this.constrainWidth.bind(this),
			'viewport-width': this.viewportWidth.bind(this),
			'viewport-height': this.viewportHeight.bind(this)
		}
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
