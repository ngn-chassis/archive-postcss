const postcss = require('postcss')
const nesting = require('postcss-nesting')

class ChassisSpecsheet {
	constructor (chassis, filepath) {
		this.chassis = chassis
		
		this.directoryPath = NGN.coalesce(chassis.utils.getFilePath(filepath), '')
		this.css = chassis.utils.parseStylesheet(filepath)
		
		this.css = this.unnest(this.css)
		
		this.css.walkAtRules('chassis', (atRule) => {
			this.processAtRule(atRule)
		})
	}
	
	processAtRule (atRule, range = null) {
		let { atRules, generator, importer } = this.chassis
		let params = atRule.params.split(' ')
		let line = atRule.source.start
		
		let mixin = params[0]
		let cfg = {
			args: params.length > 1 ? params.slice(1) : null
		}
		
		if (range) {
			cfg.range = range
		}
		
		switch (mixin) {
			case 'import':
				atRule.replaceWith(importer.importStylesheet(`${this.directoryPath}/${cfg.args[0].replace(/\"/g, "")}`))
				break
		
			case 'generate':
				generator.generate(this.css, atRule, line, cfg)
				break
		
			default:
				atRules.process(this.css, mixin, atRule, line, cfg)
		}
	}
	
	unnest (stylesheet) {
		return postcss.parse(nesting.process(stylesheet))
	}
}

module.exports = ChassisSpecsheet
