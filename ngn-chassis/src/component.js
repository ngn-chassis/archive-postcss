const ChassisStylesheet = require('./stylesheet.js')

class ChassisComponent {
  constructor (chassis) {
    this.chassis = chassis
  }

  get css () {
    let { settings } = this.chassis

    settings.componentResetSelectors[this.resetType].push(...this.selectors)

    if (this.extensions) {
			settings.componentResetSelectors[this.resetType].push(...this.extensions)
		}

    return new ChassisStylesheet(this.chassis, this.parseSpecsheet(this.stylesheet), false).css
  }

  injectThemeProps (atRule) {
    console.log(`Injecting ${atRule.params.length > 0 ? atRule.params : atRule.name} ${this.name} theme props.`);
  }

  parseSpecsheet (path) {
    let { settings, utils } = this.chassis

    let tree = utils.files.parseStylesheet(path)

    tree.walkAtRules((atRule) => {
      let param = atRule.params
      let replace = false

      switch (atRule.name) {
        case 'state':
          replace = this.states.includes(param)
          break;

        case 'child':
          replace = this.children.includes(param)
          break;

        case 'variant':
          replace = this.variants.includes(param)
          break;

        case 'legacy':
          replace = settings.legacy
          break;

        default:
          return
      }

      if (replace) {
        this.injectThemeProps(atRule)
        atRule.replaceWith(atRule.nodes)
        return
      }

      atRule.remove()
    })

    return this.resolveVars(tree)
  }

  resolveVars (tree) {
    let { utils } = this.chassis

    if (!this.variables) {
      return
    }

    tree.walkRules((rule) => {
      rule.selector = this.selectors.map((selector) => {
        return utils.string.resolveVariables(rule.selector, {selector})
      }).join(',')

      rule.walkDecls((decl) => {
        decl.prop = utils.string.resolveVariables(decl.prop, this.variables)
        decl.value = utils.string.resolveVariables(decl.value, this.variables)
      })
    })

    return tree
  }
}

module.exports = ChassisComponent
