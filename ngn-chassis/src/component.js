const ChassisStyleSheet = require('./style-sheet.js')

class ChassisComponent {
  constructor (chassis, theme) {
    this.chassis = chassis
    this.theme = theme
    
    this.states = []
    this.children = []
    this.variants = []
    this.subcomponents = []
  }

  get css () {
    let { extensions, settings } = this.chassis

    settings.componentResetSelectors[this.resetType].push(...this.selectors)

    if (this.extensions) {
			settings.componentResetSelectors[this.resetType].push(...NGN.coalesce(extensions[this.name], null))
		}

    return new ChassisStyleSheet(this.chassis, this.parseSpecSheet(`../components/${this.name}/spec.css`), false).css
  }

  // injectThemeDecls (atRule) {
  //   let { theme, utils } = this.chassis
  //   let themeDecls = this.getThemeDecls(atRule.params)
  //
  //   if (themeDecls.length > 0) {
  //     atRule.nodes.push(...themeDecls.map((decl) => {
  //       return utils.css.newDecl(decl.prop, decl.value)
  //     }))
  //   }
  //
  //   console.log(atRule.nodes);
  //
  //   // ;
  //   // console.log(`Injecting ${atRule.params.length > 0 ? atRule.params : atRule.name} ${this.name} theme props.`);
  // }
  
  getThemeDecls (state) {
		let { theme, utils } = this.chassis
		let decls = this.getStateProperties(state)

		if (decls) {
			return Object.keys(decls).map((decl) => utils.css.newDecl(decl, decls[decl]))
		}

		return []
	}

	getStateProperties (state) {
		if (!this.theme) {
			return []
		}

		if (state === 'default') {
			let defaults = {}

			for (let prop in this.theme) {
				if (typeof this.theme[prop] === 'string') {
					defaults[prop] = this.theme[prop]
				}
			}

			return defaults
		}

		if (this.theme.hasOwnProperty(state)) {
			return this.theme[state]
		}

		// console.info(`[INFO] ${this.filename} does not contain theming information for "${component}" component. Using default styles...`)
		return null
	}

  parseSpecSheet (path) {
    let { settings, utils } = this.chassis

    let tree = utils.files.parseStyleSheet(path)
    let root = utils.css.newRoot([])
    
    tree.walkAtRules('state', (atRule) => {
      let state = atRule.params
      this.states.push(state)
      
      let rules = atRule.nodes
      let themeDecls = this.getThemeDecls(state)
      
      root.append(...rules)
    })
    
    // TODO: Handle variants

    return this.resolveVars(root)
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
