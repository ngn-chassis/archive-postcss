const ChassisStyleSheet = require('./style-sheet.js')

class ChassisComponent {
  constructor (chassis, name, customSpec = null) {
    this.chassis = chassis
    this.name = name
    this.customSpec = customSpec
    
    this.states = []
    this.variants = []
    this.subcomponents = []
    
    this.theme = chassis.theme.getComponentProperties(this.name)
    this.defaultSpec = chassis.utils.files.parseStyleSheet(`../components/${this.name}/spec.css`)
  }
  
  /**
   * @property asJson
   * @return {object} json
   */
  get asJson () {
    return {
      name: this.name,
      theme: this.theme,
      selectors: this.selectors,
      states: this.states,
      children: this.children,
      variants: this.variants,
      subcomponents: this.subcomponents
    }
  }
  
  /**
   * @property css
   * Generate component AST to be appended to stylesheet
   * @return {AST}
   */
  get css () {
    let { extensions, settings, theme, utils } = this.chassis

    settings.componentResetSelectors[this.resetType].push(...this.selectors)

    if (extensions.hasOwnProperty(this.name)) {
			settings.componentResetSelectors[this.resetType].push(...extensions[this.name])
      this.selectors.push(...extensions[this.name]);
		}
    
    let tree = NGN.coalesce(this.customSpec, this.defaultSpec)

    return new ChassisStyleSheet(this.chassis, this.renderSpecSheet(tree, NGN.coalesce(this.overridesLinks, false)), false).css
  }
  
  
  // TODO: Convert these to objects first and diff those. Add this functionality to theme.js
  getDiffedDecls () {
    let { theme, utils } = this.chassis
    
    this.customSpec.forEach((atRule) => {
      let state = atRule.params
      let defaultRules = null
      
      switch (atRule.name) {
        case 'state':
          this.defaultSpec.walkAtRules('state', (defaultAtRule) => {
            if (defaultAtRule.params === state) {
              defaultNodes = defaultAtRule.nodes
            }
          })
          break;
    
        default:
          return
      }
      
      if (!defaultNodes) {
        return
      }
      
      defaultRules.forEach((rule) => {
        
      })
    })
    
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
  
  /**
   * @method parseSpecSheet
   * parse a component's spec sheet and generate and apply theme
   * @param  {string} path
   * @return {AST}
   */
  renderSpecSheet (tree, overrideLinks = false) {
    let { theme, utils } = this.chassis
    
    let root = utils.css.newRoot([])
    
    tree.walkAtRules('state', (atRule) => {
      let state = atRule.params
      this.states.push(state)
      
      let overrides = null
      
      if (overrideLinks) {
        overrides = this._generateLinkOverrides(state)
      }
      
      theme.applyToComponent(this.asJson, this.resolveVars(atRule.nodes), state, root, overrides)
    })
    
    // tree.walkAtRules('variant', (atRule) => {
    //   let variant = atRule.params
    //   this.variants.push(variant)
    //
    //   EXTEND THE COMPONENT
    // })
    
    if (this.name === 'link') {
      this._storeLinkOverrideProps()
    }

    return root
  }

  /**
   * @method resolveVars
   * resolve variables in a set of rules from a component spec sheet
   * @param  {array} rules
   * @param  {variables} [variables=this.variables]
   * @return {array} of resolved rules
   */
  resolveVars (rules, variables = this.variables) {
    let { utils } = this.chassis

    rules.forEach((rule) => {
      rule.selector = this.selectors.map((selector) => {
        return utils.string.resolveVariables(rule.selector, {selector})
      }).join(',')

      rule.walkDecls((decl) => {
        decl.prop = utils.string.resolveVariables(decl.prop, variables)
        decl.value = utils.string.resolveVariables(decl.value, variables)
      })
    })

    return rules
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
  
    let linkDecls = theme.getDecls(globalLinkOverrides.theme)
    let defaultDecls = theme.getDecls(defaultState)
    let stateDecls = theme.getDecls(currentState)
  
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
}

module.exports = ChassisComponent
