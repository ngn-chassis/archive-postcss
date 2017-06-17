class ChassisLayoutMixins {
  constructor (chassis) {
    this.chassis = chassis
  }

  /**
	 * @mixin constrainWidth
	 * @return {array} of decls
	 */
   constrainWidth (root, atRule, data) {
 		let { layout, settings, utils } = this.chassis

 		let { args, nodes } = data.cfg
 		let stripPadding = NGN.coalesce(args && args.includes('no-padding'), false)
 		let parent = atRule.parent

 		root.insertAfter(parent, utils.css.newAtRule({
 			name: 'media',
 			params: `screen and (max-width: ${settings.layout.minWidth}px)`,
 			nodes: [
 				utils.css.newRule(parent.selector, [
 					utils.css.newDeclObj('padding-left', layout.minGutterWidth),
 					utils.css.newDeclObj('padding-right', layout.minGutterWidth)
 				])
 			]
 		}))

 		root.insertAfter(parent, utils.css.newAtRule({
 			name: 'media',
 			params: `screen and (min-width: ${settings.layout.maxWidth}px)`,
 			nodes: [
 				utils.css.newRule(parent.selector, [
 					utils.css.newDeclObj('padding-left', layout.maxGutterWidth),
 					utils.css.newDeclObj('padding-right', layout.maxGutterWidth)
 				])
 			]
 		}))

 		let decls = [
 			utils.css.newDecl('width', '100%'),
 			utils.css.newDecl('min-width', `${settings.layout.minWidth}px`),
 			utils.css.newDecl('max-width', `${settings.layout.maxWidth}px`),
 			utils.css.newDecl('margin', '0 auto')
 		]

 		if (!stripPadding) {
 			decls = [
 				...decls,
 				utils.css.newDecl('padding-left', settings.layout.gutter),
 				utils.css.newDecl('padding-right', settings.layout.gutter)
 			]
 		}

 		atRule.replaceWith(decls)
 	}
}

module.exports = ChassisLayoutMixins
