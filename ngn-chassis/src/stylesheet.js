const nesting = require('postcss-nesting')

class ChassisStylesheet {
	constructor (chassis, source) {
		this.chassis = chassis
		this.css = source
		
		if (NGN.typeof(source) === 'string') {
			this.directoryPath = NGN.coalesce(chassis.utils.getFilePath(source), '')
			this.css = chassis.utils.parseStylesheet(source)
		}
		
		this.css.walkAtRules('chassis', (atRule) => {
			this.processAtRule(atRule)
		})
	}
 	
	processAtRule (atRule) {
		let { generator, importer, mixins } = this.chassis
		let params = atRule.params.split(' ')
		let line = atRule.source.start
		
		let mixin = params[0]
		let cfg = {
			args: params.length > 1 ? params.slice(1) : null,
			nodes: NGN.coalesce(atRule.nodes, [])
		}
		
		switch (mixin) {
			case 'import':
				atRule.replaceWith(importer.importStylesheet(`${this.directoryPath}/${cfg.args[0].replace(/\"/g, "")}`))
				break
		
			// case 'generate':
			// 	generator.generate(this.css, atRule, line, data)
			// 	break
		
			default:
				mixins.process(this.css, mixin, atRule, line, cfg)
		}
	}
	
	unnest (stylesheet) {
		return postcss.parse(nesting.process(stylesheet))
	}
}

module.exports = ChassisStylesheet
