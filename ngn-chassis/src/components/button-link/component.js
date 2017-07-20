const ChassisComponent = require('../../component.js')

class ChassisButtonComponent extends ChassisComponent {
  constructor (chassis, theme) {
    super(chassis, theme)
    this.chassis = chassis

    this.name = 'button-link'
    this.selectors = ['a.button']
    this.resetType = 'inline-block'
  }

  get variables () {
    let { settings, typography, utils } = this.chassis
    let { fontSize, lineHeight } = settings.typography.ranges.first.typography.root

    let lineHeightMultiplier = utils.units.toEms(lineHeight, fontSize)
    let inlineHeight = typography.calculateInlineHeight(lineHeightMultiplier)
		let padding = (inlineHeight - lineHeightMultiplier) / 2

    return {
      'margin-right': `${typography.calculateInlineMarginX(lineHeightMultiplier)}em`,
      'margin-bottom': `${typography.calculateInlineMarginY(lineHeightMultiplier)}em`,
      'padding-x': `${typography.calculateInlinePaddingX(lineHeightMultiplier)}em`,
      'line-height': typography.calculateInlineHeight(lineHeightMultiplier),
      'icon-offset': `translateX(-${(typography.calculateInlinePaddingX(lineHeightMultiplier) / 2) - utils.units.toEms(fontSize / (settings.typography.scaleRatio * 10), fontSize)}em)`,
      'pill-padding-x': `${settings.typography.scaleRatio}em`,
      'pill-border-radius': `${lineHeightMultiplier}em`,
      'multi-line-padding-y': `${padding}em`,
			'multi-line-line-height': `${lineHeightMultiplier}`,
			'multi-line-white-space': 'normal'
    }
  }
  
  generateOverrides (state) {
		let { linkOverrides, theme, utils } = this.chassis
	
		let globalLinkOverrides = linkOverrides.find((override) => {
			return override.state === state
		})
	
		if (!globalLinkOverrides) {
			return []
		}
  
    let defaultState = this.getStateTheme('default')
    let currentState = this.getStateTheme(state)
  
    let linkDecls = theme.getDecls(globalLinkOverrides)
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
  
		return overrides
	}
}

module.exports = ChassisButtonComponent
