const postcss = require('postcss')
const nesting = require('postcss-nesting')

class ChassisStyleSheet {
	constructor (chassis, tree, namespace = true) {
		this.chassis = chassis
		this.tree = tree
		this.namespace = namespace
	}

	get css () {
		// Process all but 'include', 'new' and 'extend' mixins
		// These need to be processed after the unnest operation to properly resolve
		// nested selectors
		this.tree.walkAtRules('chassis', (atRule) => {
			if (!(atRule.params.startsWith('include') || atRule.params.startsWith('new') || atRule.params.startsWith('extend'))) {
				this.processAtRule(atRule)
			}
		})

		// in cssnext, nesting isn't handled correctly, so we're short-circuiting it
		// by handling unnesting here
		this.unnest()

		let output = postcss.parse(this.tree)

		// Process remaining 'new' and 'extend' mixins
		output.walkAtRules('chassis', (atRule) => {
			if (atRule.params.startsWith('new') || atRule.params.startsWith('extend')) {
				this.processAtRule(atRule)
			}
		})

		// Process remaining 'include' mixins
		output.walkAtRules('chassis', (atRule) => {
			if (atRule.params.startsWith('include')) {
				this.processAtRule(atRule)
			}
		})

		// Cleanup empty rulesets and prepend .chassis namespace to all selectors
		// except 'html' and ':root'
		output.walkRules((rule) => {
			if (rule.nodes.length === 0) {
				rule.remove()
				return
			}

			if (this.namespace) {
				rule.selector = rule.selector === 'html' || rule.selector === ':root'  ? rule.selector.trim() : `.chassis ${rule.selector.trim()}`

				if (rule.selector.includes(',')) {
					rule.selector = rule.selector.split(',').map((selector) => selector.trim()).join(', .chassis ')
				}
			}
		})

		return output
	}

	processAtRule (atRule) {
		let data = Object.assign({
			root: this.tree,
			atRule
		}, this.chassis.atRules.getProperties(atRule))

		this.chassis.atRules.process(data)
	}

	unnest () {
		this.tree = nesting.process(this.tree)
	}
}

module.exports = ChassisStyleSheet
