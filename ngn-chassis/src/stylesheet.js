const postcss = require('postcss')
const customProperties = require('postcss-custom-properties')
const nesting = require('postcss-nesting')

class ChassisStylesheet {
	constructor (chassis, tree) {
		this.chassis = chassis
		this.tree = tree
	}

	get css () {
		this.tree.walkAtRules('chassis', (atRule) => {
			this.processAtRule(atRule)
		})

		this.unnest()
		this.resolveVariables()

		return postcss.parse(this.tree)
	}

	getAtRuleProperties (atRule) {
		let params = atRule.params.split(' ')

		return {
			source: atRule.source.start,
			mixin: params[0],
			args: params.length > 1 ? params.slice(1) : null,
			nodes: atRule.nodes || []
		}
	}

	processAtRule (atRule) {
		let data = {
			root: this.tree,
			atRule
		}

		this.chassis.atRules.process(Object.assign(data, this.getAtRuleProperties(atRule)))
	}

	unnest () {
		this.tree = nesting.process(this.tree)
	}

	resolveVariables () {
		this.tree = customProperties.process(this.tree)
	}
}

module.exports = ChassisStylesheet
