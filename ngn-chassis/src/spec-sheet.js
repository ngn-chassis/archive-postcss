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
		
		this.spec.walkAtRules('state', (atRule) => this.states.push(atRule.params))
	}
	
	get css () {
		let template = this.generateTemplate()
		return this.resolveVariables(template)
	}
	
	applyCustomSpec (customSpec) {
		let template = this.generateTemplate(customSpec)
		
		let customVariables = Object.assign(this.variables, {
			selectors: customSpec.nodes[0].selector.split(',')
		})
		
		return this.resolveVariables(template, customVariables)
	}
	
	_findMatchingState (state, customSpec) {
		let customState = null
		
		customSpec.walkAtRules('state', (atRule) => {
			if (atRule.params === state.params) {
				customState = atRule
			}
		})
		
		return customState
	}
	
	generateTemplate (customSpec = null) {
		let { utils } = this.chassis
		let root = utils.css.newRoot([])
		
		this.spec.walkAtRules((state) => {
			switch (state.name) {
				case 'state':
					if (customSpec) {
						let customState = this._findMatchingState(state, customSpec)
						
						if (!customState) {
							return
						}
						
						this._applyCustomizedState(state, customState)
					}
					
					state.nodes.forEach((node) => root.append(node))
					break
					
				case 'legacy':
					state.nodes.forEach((node) => root.append(node))
					break
					
				default:
					return
			}
		})
		
		return root
	}
	
	resolveVariables (root, variables = this.variables) {
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
	
	_applyCustomizedState (state, customState) {
		let { utils } = this.chassis
		
		if (!this.states.includes(customState.params)) {
			console.warn(`[WARNING] Chassis "${this.type}" component does not support "${customState.params}" state. Discarding...`)
			return
		}
		
		let customRules = customState.nodes.filter((node) => node.type === 'rule')
		let customDecls = customState.nodes.filter((node) => node.type === 'decl')
		
		state.walkRules((rule, index) => {
			// Default state is always first
			if (index === 0) {
				this._mergeDecls(rule, customDecls)
			}
			
			let customRuleIndex
			
			let match = customRules.find((customRule, i) => {
				customRuleIndex = i
				return customRule.selector.replace('&', '').trim() === rule.selector.replace('$(selector)', '').trim()
			})
		
			if (match) {
				customRules.splice(customRuleIndex, 1)
				this._mergeRules(rule, match)
			}
		})
		
		customRules.forEach((customRule) => {
			customRule.selector = `${state.nodes[0].selector}${customRule.selector.replace('&', '')}`
		})
		
		state.nodes.push(...customRules)
	}
	
	_mergeDecls (rule, customDecls) {
		rule.walkDecls((decl) => {
			let index
			
			let match = customDecls.find((customDecl, i) => {
				index = i
				return customDecl.prop === decl.prop
			})
			
			if (match) {
				customDecls.splice(index, 1)
				decl.replaceWith(match)
			}
		})
		
		rule.nodes.push(...customDecls)
	}
	
	_mergeRules (rule, custom) {
		let customRules = custom.nodes.filter((node) => node.type === 'rule')
		let customDecls = custom.nodes.filter((node) => node.type === 'decl')
		
		this._mergeDecls(rule, customDecls)
	}
}

module.exports = ChassisSpecSheet
