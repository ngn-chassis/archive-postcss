class ChassisAtRules {
	constructor (chassis) {
		this.chassis = chassis
		
		this.mixins = {
			'constrain-width': this.constrainWidth.bind(this)
		}
	}
	
	/**
	 * @mixin constrainWidth
	 * @param  {object}  line
	 * Line and column at which mixin was called
	 * @param  {Boolean} [hasPadding=true]
	 * Whether or not to add layout gutter to left and right
	 * @return {array} of decls
	 */
	constrainWidth (root, atRule, cfg) {
		let { layout, settings, utils } = this.chassis
		
		let { args, nodes } = cfg
		let stripPadding = NGN.coalesce(args && args.includes('no-padding'), false)
		let parent = atRule.parent
		
		root.insertAfter(atRule.parent, utils.newAtRule({
			name: 'media',
			params: `screen and (max-width: ${settings.layout.minWidth}px)`,
			nodes: [
				utils.newRule(atRule.parent.selector, [
					utils.newDeclObj('padding-left', layout.minGutterWidth),
					utils.newDeclObj('padding-right', layout.minGutterWidth)
				])
			]
		}))
		
		root.insertAfter(atRule.parent, utils.newAtRule({
			name: 'media',
			params: `screen and (min-width: ${settings.layout.maxWidth}px)`,
			nodes: [
				utils.newRule(atRule.parent.selector, [
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
		
		atRule.replaceWith(decls)
	}
	
	process (root, mixin, atRule, line, cfg) {
		if (this.mixins.hasOwnProperty(mixin)) {
			this.mixins[mixin](root, atRule, cfg)
			return
		}
		
		console.error(`Chassis stylesheet line ${line.line}, column ${line.column}: Mixin "${mixin}" not found.`)
	}
}

module.exports = ChassisAtRules
