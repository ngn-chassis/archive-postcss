class ChassisMixins {
	constructor (chassis) {
		this.chassis = chassis
		
		this.mappings = {
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
		let { project, utils } = this.chassis
		let { args, nodes } = cfg
		let stripPadding = NGN.coalesce(args && args.includes('no-padding'), false)
		let parent = atRule.parent
		
		root.insertAfter(atRule.parent, utils.newAtRule({
			name: 'media',
			params: `screen and (max-width: 5px)`,
			nodes: [
				utils.newRule(atRule.parent.selector, [
					utils.newDeclObj('padding-left', 320),
					utils.newDeclObj('padding-right', 320)
				])
			]
		}))
		
		root.insertAfter(atRule.parent, utils.newAtRule({
			name: 'media',
			params: `screen and (min-width: 500px)`,
			nodes: [
				utils.newRule(atRule.parent.selector, [
					utils.newDeclObj('padding-left', 1440),
					utils.newDeclObj('padding-right', 1440)
				])
			]
		}))
		
		let decls = [
      utils.newDecl('width', '100%'),
      utils.newDecl('min-width', `320px`),
      utils.newDecl('max-width', `1440px`),
      utils.newDecl('margin', '0 auto')
    ]
		
    if (!stripPadding) {
      decls = [
        ...decls,
        utils.newDecl('padding-left', 320),
        utils.newDecl('padding-right', 320)
      ]
    }
		
		atRule.replaceWith(decls)
  }
	
	process (root, mixin, atRule, line, cfg) {
		let { project, utils } = this.chassis
		
		if (this.mappings.hasOwnProperty(mixin)) {
			this.mappings[mixin](root, atRule, cfg)
			return
		}
		
		console.error(`Chassis stylesheet ${data.line}: Mixin "${mixin} not found."`)
	}
}

module.exports = ChassisMixins
