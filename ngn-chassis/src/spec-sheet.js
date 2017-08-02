const nesting = require('postcss-nesting')

class ChassisSpecSheet {
	constructor (chassis, type, spec, variables = {}) {
		this.chassis = chassis
		this.type = type
		this.spec = spec
		
		this.states = []
		
		this.spec.walkComments((comment) => comment.remove())
		
		this.selectors = this.spec.nodes[0].selector.split(',')
		
		if (chassis.componentExtensions.hasOwnProperty(type)) {
      this.selectors.push(...chassis.componentExtensions[type]);
		}
		
		this.variables = Object.assign(variables, {
			selectors: this.selectors
		})
		
		this.spec.walkAtRules('state', (atRule) => this.states.push(atRule.params))
	}
	
	getCss (overrides = null) {
		let template = this.generateTemplate(null, overrides)
		
		return this.resolveVariables(template)
	}
	
	getCustomizedCss (customSpec) {
		let template = this.generateCustomTemplate(customSpec)
		
		let customVariables = Object.assign(this.variables, {
			selectors: customSpec.nodes[0].selector.split(',')
		})
		
		return this.resolveVariables(template, customVariables)
	}
	
	getUnthemedCss (customSpec) {
		let template = this.generateTemplate(customSpec)
		
		let customVariables = Object.assign(this.variables, {
			selectors: customSpec.nodes[0].selector.split(',')
		})
		
		return this.resolveVariables(template, customVariables)
	}
	
	getThemedCss (theme, overrides = null) {
		let template = this.generateTemplate(theme, overrides)
		
		return this.resolveVariables(template)
	}
	
	generateCustomTemplate (customSpec) {
		let { utils } = this.chassis
		let root = utils.css.newRoot([])
		
		this.spec.walkAtRules((state) => {
			switch (state.name) {
				case 'state':
					let customState = this._findMatchingState(state, customSpec)
					
					if (!customState) {
						return
					}
					
					this._generateCustomizedState(state, customState)
					state.nodes.forEach((node) => root.append(node))
					break
					
				default:
					return
			}
		})
		
		return root
	}
	
	generateTemplate (customSpec = null, overrides = null) {
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
			customRule.selector = `${state.nodes[0].selector} ${customRule.selector.replace('&', '').trim()}`
		})
		
		state.nodes.push(...customRules)
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
	
	_generateCustomizedState (state, customState) {
		let { utils } = this.chassis
		
		if (!this.states.includes(customState.params)) {
			console.warn(`[WARNING] Chassis "${this.type}" component does not support "${customState.params}" state. Discarding...`)
			return
		}
		
		let customRules = customState.nodes.filter((node) => node.type === 'rule')
		let customDecls = customState.nodes.filter((node) => node.type === 'decl')
		
		state.walkRules((rule, index) => {
			if (index === 0) {
				rule.nodes = customDecls
				return
			}
		
			let customRuleIndex
			
			let match = customRules.find((customRule, i) => {
				customRuleIndex = i
				return customRule.selector.replace('&', '').trim() === rule.selector.replace('$(selector)', '').trim()
			})
			
			if (match) {
				customRules.splice(customRuleIndex, 1)
				rule.nodes = match.nodes.filter((node) => node.type === 'decl')
			} else {
				rule.remove()
			}
		})
	}
	
	/**
   * @method _generateLinkOverrides
   * Generate decls to overwrite link properties for components which use
   * <a> tags in conjunction with classes or attributes
   * @param  {string} state
   * State of the current component
   * @return {array} of decls.
   * @private
   */
  _generateLinkOverrides (state) {
		let { linkOverrides, theme, utils } = this.chassis
	
		let globalLinkOverrides = linkOverrides.find((override) => {
			return override.state === state
		})
	
		if (!globalLinkOverrides) {
			return []
		}
  
    let defaultState = this.getStateTheme('default')
    let currentState = this.getStateTheme(state)
  
    let linkDecls = utils.css.generateDeclsFromTheme(globalLinkOverrides.theme)
    let defaultDecls = utils.css.generateDeclsFromTheme(defaultState)
    let stateDecls = utils.css.generateDeclsFromTheme(currentState)
  
    let linkUniqueProps = utils.css.getUniqueProps(linkDecls, stateDecls)
  
    // TODO: Handle nested rulesets
    // let defaultRules = theme.getRules(defaultTheme)
    // let stateRules = theme.getRules(stateTheme)
    
    if (state === 'default') {
			return linkUniqueProps.map((prop) => utils.css.newDecl(prop, 'unset'))
		}
    
    let overrides = []
  
    // Props common between Link Component State and Default Button Component State
		let commonDecls = utils.css.getCommonProps(linkDecls, stateDecls)
  
    // If both link.${state} AND button.default themes include a property,
		// AND it is not already included in the button.${state} theme, add this override:
		// property: button.default value;
		if (commonDecls.length > 0) {
			let defaultOverrides = commonDecls.map((prop) => {
				return stateDecls.find((decl) => decl.prop === prop)
			}).filter((entry) => entry !== undefined)
  
			overrides.push(...defaultOverrides)
		}

    // If a property is included in link.${state} theme but not default button theme,
		// AND it is NOT already included in the button.${state} theme,
		// unset it in ${state} button theme
		if (linkUniqueProps.length > 0) {
			let unset = linkUniqueProps.filter((prop) => {
				return !commonDecls.includes(prop)
			}).filter((prop) => {
				return !stateDecls.some((decl) => decl.prop === prop)
			})
	
			// Check for properties in the default theme which should be applied
			// instead of unsetting the property, and if present, add them to overrides
			let indexesToRemove = []
	
			unset.forEach((prop, index) => {
				let matchInDefaultDecls = defaultDecls.find((decl) => decl.prop === prop)
	
				if (matchInDefaultDecls) {
					indexesToRemove.push(index)
					overrides.push(matchInDefaultDecls)
				}
			})
	
			// Remove properties from unset if they are already present in the default theme
			indexesToRemove.forEach((index) => {
				unset.splice(index, 1)
			})
  
			if (unset.length > 0) {
				overrides.push(...unset.map((prop) => {
					return utils.css.newDecl(prop, 'unset')
				}))
			}
		}
  
		return overrides.length > 0 ? overrides : null
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
