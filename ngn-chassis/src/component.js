const ChassisStyleSheet = require('./style-sheet.js')

class ChassisComponent {
  constructor (chassis, theme) {
    this.chassis = chassis
    this.theme = theme
    
    this.states = []
    this.variants = []
    this.subcomponents = []
  }
  
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

  get css () {
    let { extensions, settings } = this.chassis

    settings.componentResetSelectors[this.resetType].push(...this.selectors)

    if (this.extensions) {
			settings.componentResetSelectors[this.resetType].push(...NGN.coalesce(extensions[this.name], null))
		}

    return new ChassisStyleSheet(this.chassis, this.parseSpecSheet(`../components/${this.name}/spec.css`), false).css
  }
  
  getStateTheme (state) {
		if (!this.theme) {
			return null
		}

		if (this.theme.hasOwnProperty(state)) {
			return this.theme[state]
		}

		// console.info(`[INFO] ${this.filename} does not contain theming information for "${component}" component. Using default styles...`)
		return null
	}

  parseSpecSheet (path) {
    let { theme, utils } = this.chassis

    let tree = utils.files.parseStyleSheet(path)
    let root = utils.css.newRoot([])
    
    tree.walkAtRules('state', (atRule) => {
      let state = atRule.params
      this.states.push(state)
      
      let defaultRules = this.resolveVars(atRule.nodes)
      let overrides = null
      
      if ('generateOverrides' in this) {
        overrides = this.generateOverrides(state)
        
        if (overrides.length === 0) {
          overrides = null
        }
      }
      
      theme.applyToComponent(this.asJson, defaultRules, state, root, overrides)
    })
    
    // TODO: Handle variants
    
    this.postCallback && this.postCallback(tree)

    return root
  }

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
}

module.exports = ChassisComponent
