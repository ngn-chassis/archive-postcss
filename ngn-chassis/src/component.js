const ChassisStyleSheet = require('./style-sheet.js')

class ChassisComponent {
  constructor (chassis) {
    this.chassis = chassis
    this.states = []
  }
  
  /**
   * @property css
   * Generate component AST to be appended to stylesheet
   * @return {AST}
   */
  get css () {
    let { componentExtensions, settings, theme, utils } = this.chassis
    
    this.theme = theme.getComponent(this.name)

    settings.componentResetSelectors[this.resetType].push(...this.selectors)

    if (componentExtensions.hasOwnProperty(this.name)) {
			settings.componentResetSelectors[this.resetType].push(...componentExtensions[this.name])
      this.selectors.push(...componentExtensions[this.name]);
		}
    
    let renderedSpec = this._renderSpecSheet(this.spec, NGN.coalesce(this.overridesLinks, false))

    return new ChassisStyleSheet(this.chassis, renderedSpec, false).css
  }
  
  get spec () {
    return this.chassis.utils.files.parseStyleSheet(`../components/${this.name}/spec.css`)
  }
  
  /**
   * @method getStateTheme
   * Get theme properties and rules for a particular component state
   * @param  {string} state
   * @return {object}
   */
  getStateTheme (state) {
		if (!this.theme || !this.theme.hasOwnProperty(state)) {
			return null
		}

		return this.theme[state]
	}
  
  _appendNestedRulesets (root, selectors, nestedRules) {
		let { utils } = this.chassis
	
		Object.keys(nestedRules).forEach((nestedRule) => {
			let nestedSelector = selectors.map((selector) => `${selector} ${nestedRule}`).join(', ')
			let { properties, rules } = nestedRules[nestedRule]
	
			let decls = Object.keys(properties).map((property) => {
				return utils.css.newDeclObj(property, properties[property])
			})
	
			root.append(utils.css.newRule(nestedSelector, decls))
	
			if (Object.keys(rules).length > 0) {
				this.appendNestedRulesets(root, [nestedSelector], rules)
			}
		})
	}
  
  _applyTheme (defaultRules, state, root, overrides = null) {
		let { utils } = this.chassis
	
		if (!this.theme || !this.theme[state]) {
			return root.append(...defaultRules)
		}
	
		let propKeys = Object.keys(this.theme[state].properties)
		let ruleKeys = Object.keys(this.theme[state].rules)
	
		if (propKeys.length > 0) {
			if (defaultRules.length === 0) {
				defaultRules.push(utils.css.newRule(this.selectors.join(', ')))
			}
	
			let defaultRule = defaultRules[0]
			let decls = []
	
			for (let property in this.theme[state].properties) {
				decls.push(utils.css.newDecl(property, this.theme[state].properties[property]))
			}
	
			if (overrides) {
				decls = utils.css.mergeDecls(decls, overrides)
			}
	
			defaultRule.nodes = utils.css.mergeDecls(defaultRule.nodes, decls)
		}
	
		root.append(...defaultRules)
	
		if (ruleKeys.length > 0) {
			let rulesets = this._appendNestedRulesets(root, this.selectors, this.theme[state].rules)
		}
	
		return root
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
  
  /**
   * @method parseSpecSheet
   * parse a component's spec sheet and generate and apply theme
   * @param  {string} path
   * @return {AST}
   */
  _renderSpecSheet (tree, overrideLinks = false) {
    let { componentExtensions, theme, utils } = this.chassis
    
    let root = utils.css.newRoot([])
    
    tree.walkAtRules((atRule) => {
      switch (atRule.name) {
        case 'state':
          this._renderState(atRule, root, overrideLinks)
          break;
          
        case 'legacy':
          root.append(this._resolveVars(atRule.nodes))
          break;
          
        default:
          return
      }
    })
    
    if (this.name === 'link') {
      this._storeLinkOverrideProps()
    }

    return root
  }
  
  _renderState (atRule, root, overrideLinks = false) {
    let state = atRule.params
    this.states.push(state)
    
    let overrides = null
    
    if (overrideLinks) {
      overrides = this._generateLinkOverrides(state)
    }
    
    this._applyTheme(this._resolveVars(atRule.nodes), state, root, overrides)
  }

  /**
   * @method resolveVars
   * resolve variables in a set of rules from a component spec sheet
   * @param  {array} rules
   * @param  {variables} [variables=this.variables]
   * @return {array} of resolved rules
   */
  _resolveVars (nodes, variables = this.variables) {
    nodes.forEach((node) => {
      if (node.type === 'atrule') {
        node.nodes.forEach((innerNode) => {
          this._resolveVars([innerNode], variables)
        })
        
      } else if (node.type === 'rule') {
        this._resolveRuleVars(node, variables)
      }
    })

    return nodes
  }
  
  _resolveRuleVars (rule, variables) {
    let { utils } = this.chassis
    
    rule.selector = this.selectors.map((selector) => {
      return utils.string.resolveVariables(rule.selector, {selector})
    }).join(',')

    rule.walkDecls((decl) => {
      decl.prop = utils.string.resolveVariables(decl.prop, variables)
      decl.value = utils.string.resolveVariables(decl.value, variables)
    })
  }
  
  /**
   * @method _storeLinkOverrideProps
   * Store link properties so they can be selectively overwritten by components
   * which use <a> tags in conjunction with classes or attributes
   * @private
   */
  _storeLinkOverrideProps () {
    // All decls applied to <a> tags will be unset or overridden on other
    // components that use <a> tags in conjunction with a class or attr
    this.states.forEach((state) => {
      let theme = this.getStateTheme(state)
      
      if (!theme || Object.keys(theme).length === 0) {
        return
      }
      
      this.chassis.linkOverrides.push({state, theme})
    })
  }
}

module.exports = ChassisComponent
