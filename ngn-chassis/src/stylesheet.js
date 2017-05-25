class ChassisStylesheet {
	constructor (chassis, source) {
		this.chassis = chassis
		
		if (NGN.typeof(source) === 'string') {
			this.basePath = NGN.coalesce(chassis.utils.getFilePath(source), '')
			this.css = chassis.utils.parseStylesheet(source)
		} else {
			this.css = source
		}
	}
	
	processAtRules () {
		let { generator, importer, mixins } = this.chassis
		
		this.css.walkAtRules((rule) => {
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
					mixins.process(mixin, rule, line)
			}
		})
	}
}

module.exports = ChassisStylesheet
