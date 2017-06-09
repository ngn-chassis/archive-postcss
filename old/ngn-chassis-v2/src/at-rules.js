class ChassisAtRules {
	constructor (chassis) {
		this.chassis = chassis
		
		this.mixins = {
			'constrain-width': this.constrainWidth.bind(this)
		}
	}
	
	/**
	 * @mixin constrainWidth
	 * @return {array} of decls
	 */
	constrainWidth () {
		let { layout, settings, utils } = this.chassis
		
		let { args, nodes } = this.cfg
		let stripPadding = NGN.coalesce(args && args.includes('no-padding'), false)
		let parent = this.atRule.parent
		
		root.insertAfter(this.atRule.parent, utils.newAtRule({
			name: 'media',
			params: `screen and (max-width: ${settings.layout.minWidth}px)`,
			nodes: [
				utils.newRule(this.atRule.parent.selector, [
					utils.newDeclObj('padding-left', layout.minGutterWidth),
					utils.newDeclObj('padding-right', layout.minGutterWidth)
				])
			]
		}))
		
		root.insertAfter(this.atRule.parent, utils.newAtRule({
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
		this.cfg = data.cfg
		
		if (this.mixins.hasOwnProperty(data.mixin)) {
			this.mixins[data.mixin]()
			return
		}
		
		console.error(`Chassis stylesheet line ${data.source.line}, column ${data.source.column}: Mixin "${data.mixin}" not found.`)
	}
}

module.exports = ChassisAtRules
