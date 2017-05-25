class ChassisStylesheet {
	constructor (chassis, specPath = null) {
		this.chassis = chassis
		this.basePath = NGN.coalesce(chassis.utils.getFilePath(specPath), '')
		
		if (specPath) {
			let parsedSpec = chassis.utils.parseStylesheet(specPath)
			this.css = this.processAtRules(parsedSpec)
		} else {
			this.css = chassis.utils.newRoot([])
		}
	}
	
	processAtRules (root) {
		let { generator, importer, mixins } = this.chassis
		
		root.walkAtRules((rule) => {
			let line = rule.source.start
			let params = rule.params.split(' ')
			
			let mixin = params[0]
			let args = params.length > 1 ? params.slice(1) : null
			let nodes = NGN.coalesce(rule.nodes, [])
			
			switch (mixin) {
				case 'import':
					rule.replaceWith(importer.importStylesheet(`${this.basePath}/${args[0].replace(/\"/g, "")}`))
					break
			
				case 'generate':
					generator.generate(rule, args, line)
					break
			
				default:
					mixins.process(mixin, root, rule, line)
			}
		})
		
		return root
	}
}

module.exports = ChassisStylesheet
