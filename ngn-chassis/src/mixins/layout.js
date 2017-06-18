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

  /**
	 * @mixin zIndex
	 * Get calculated z-index value from project settings
	 */
	zIndex (root, atRule, data) {
		let { settings, utils } = this.chassis
		let index = settings.zIndex[data.cfg.args[0]]

		if (!index) {
			console.error(`[ERROR] Line ${data.source.line}: Invalid z-index alias. Accepted values: ${utils.string.listValues(settings.zIndex)}`)
		}

		atRule.replaceWith(utils.css.newDecl('z-index', index))
	}
}

module.exports = ChassisLayoutMixins
