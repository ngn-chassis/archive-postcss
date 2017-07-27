const nesting = require('postcss-nesting')

class ChassisSpecSheet {
	constructor (chassis, type, spec, variables) {
		this.chassis = chassis
		this.type = type
		this.spec = spec
		this.states = []
		
		this.spec.walkComments((comment) => comment.remove())
		
		this.variables = Object.assign(variables, {
			selectors: this.spec.nodes[0].selector.split(',')
		})
	}
	
	get css () {
		let { utils } = this.chassis
		let root = utils.css.newRoot([])
		
		this.spec.walkAtRules((atRule) => {
			switch (atRule.name) {
				case 'legacy':
				case 'state':
					atRule.nodes.forEach((node) => root.append(node))
					break
					
				default:
					return
			}
		})
		
		return this.resolveVariables(root)
	}
	
	resolveVariables (root) {
		let { utils } = this.chassis
		
		root.walkRules((rule) => {
			rule.selector = this.variables.selectors.map((selector) => {
				return utils.string.resolveVariables(rule.selector, {selector})
			}).join(', ')
			
			rule.walkDecls((decl) => {
	      decl.prop = utils.string.resolveVariables(decl.prop, this.variables)
	      decl.value = utils.string.resolveVariables(decl.value, this.variables)
	    })
		})
		
		return root
	}
}

module.exports = ChassisSpecSheet
