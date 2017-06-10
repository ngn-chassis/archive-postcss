const postcss = require('postcss')
const nesting = require('postcss-nesting')

class ChassisStylesheet {
	constructor (chassis, tree) {
		this.chassis = chassis
		this.css = this.unnest(tree)

		// this.css.walkAtRules('chassis', (atRule) => {
		// 	this.processAtRule(atRule)
		// })
	}

	processAtRule (atRule) {
		let { atRules, generator, importer } = this.chassis
		let params = atRule.params.split(' ')
		let line = atRule.source.start

		let mixin = params[0]
		let cfg = {
			args: params.length > 1 ? params.slice(1) : null,
			nodes: NGN.coalesce(atRule.nodes, [])
		}

		atRules.process(this.css, mixin, atRule, line, cfg)
	}

	unnest (stylesheet) {
		return postcss.parse(nesting.process(stylesheet))
	}
}

module.exports = ChassisStylesheet
