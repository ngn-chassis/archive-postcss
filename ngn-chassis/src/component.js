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

  parseSpecSheet (path) {
    let { theme, utils } = this.chassis

    let tree = utils.files.parseStyleSheet(path)
    let root = utils.css.newRoot([])
    
    tree.walkAtRules('state', (atRule) => {
      let state = atRule.params
      this.states.push(state)
      
      let defaultRules = this.resolveVars(atRule.nodes)
      
      theme.applyToComponent(this.asJson, defaultRules, state, root)
    })
    
    // TODO: Handle variants

    return root
  }

  resolveVars (rules) {
    let { utils } = this.chassis

    if (!this.variables) {
      return []
    }

    rules.forEach((rule) => {
      rule.selector = this.selectors.map((selector) => {
        return utils.string.resolveVariables(rule.selector, {selector})
      }).join(',')

      rule.walkDecls((decl) => {
        decl.prop = utils.string.resolveVariables(decl.prop, this.variables)
        decl.value = utils.string.resolveVariables(decl.value, this.variables)
      })
    })

    return rules
  }
}

module.exports = ChassisComponent
