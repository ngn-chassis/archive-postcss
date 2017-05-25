class ChassisMixins {
	constructor (chassis) {
		this.chassis = chassis
		
		this.mappings = {
			'constrain-width': this.constrainWidth
		}
	}
	
	get (mixin, data) {
		return this.mappings[mixin](data)
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
		let { project, utils } = this.chassis
		
    let decls = [
      utils.newDecl('width', '100%'),
      utils.newDecl('min-width', `${project.layout.minWidth}px`),
      utils.newDecl('max-width', `${project.layout.maxWidth}px`),
      utils.newDecl('margin', '0 auto')
    ]

    if (hasPadding) {
      decls = [
        ...decls,
        utils.newDecl('padding-left', project.layout.gutter),
        utils.newDecl('padding-right', project.layout.gutter)
      ]
    }

    return decls
  }
	
	process (mixin, root, rule, line) {
		let { project, utils } = this.chassis
		
		switch (mixin) {
			case 'constrain-width':
				root.insertAfter(rule.parent, utils.newAtRule({
					name: 'media'
				}))
				// root.insertAfter(rule.parent, utils.newAtRule({
				// 	name: 'media',
        //   params: `screen and (max-width: 5px)`,
        //   nodes: []
				// }))
				break
		
			default:
				console.error(`Chassis stylesheet ${line}: Mixin "${mixin} not found."`)
		}
	}
}

module.exports = ChassisMixins
