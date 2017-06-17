const postcss = require('postcss')
const nesting = require('postcss-nesting')

class ChassisStylesheet {
	constructor (chassis, tree) {
		this.chassis = chassis
		this.tree = tree

		tree.walkAtRules('chassis', (atRule) => {
			this.processAtRule(atRule, this.getAtRuleData(atRule))
		})

		this.css = this.unnest(tree)
	}

	getAtRuleData (raw, range = null) {
		let params = raw.params.split(' ')

		let cfg = {
			args: params.length > 1 ? params.slice(1) : null
		}

		if (range) {
			cfg.range = range
		}

		return {
			source: raw.source.start,
			mixin: params[0],
			cfg,
			nodes: raw.nodes || []
		}
	}

	processAtRule (atRule, data) {
		this.chassis.atRules.process(this.tree, atRule, data)
	}

	unnest (stylesheet) {
		return postcss.parse(nesting.process(stylesheet))
	}
}

module.exports = ChassisStylesheet
