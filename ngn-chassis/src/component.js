// TODO: Don't create ChassisSpecSheet for custom specs, just for default. Then,
// add a method to ChassisSpecSheet like "getCombinedSpec" or something which can
// have custom specs passed in, and return the combine stylesheet

const ChassisSpecSheet = require('./spec-sheet.js')
const ChassisStyleSheet = require('./style-sheet.js')

class ChassisComponent {
  constructor (chassis, type, customSpec, extending = false) {
    this.chassis = chassis
    this.type = type
    
    this.instance = new (chassis.constants.components.get(type))(chassis)
    
    this.overridesLinks = this.instance.hasOwnProperty('overridesLinks') && this.instance.overridesLinks
    this.theme = chassis.theme.getComponentSpec(type)
    
    this.defaultSpec = new ChassisSpecSheet(this.chassis, type, chassis.utils.files.parseStyleSheet(`../components/${type}/spec.css`), this.instance.variables, this.overridesLinks)
    this.customSpec = customSpec
    
    this.linkOverrides = []
  }
  
  get customRules () {
    if (!this.customSpec) {
      return null
    }
    
    return this.defaultSpec.getCustomizedCss(this.customSpec)
  }
  
  get unthemed () {
    if (!this.customSpec) {
      return this.defaultSpec.getCss()
    }
    
    return this.defaultSpec.getUnthemedCss(this.customSpec)
  }
  
  get themed () {
    let { chassis } = this
    
    if (this.type === 'link') {
      this._storeLinkOverrideProps()
    }
    
    if (!this.theme) {
      return this.defaultSpec.getCss(this.linkOverrides)
    }
    
    return this.defaultSpec.getThemedCss(this.theme, this.linkOverrides)
  }
  
  _applyLinkOverrides (css) {
    return css
  }
  
  /**
   * @method getStateTheme
   * Get theme properties and rules for a particular component state
   * @param  {string} state
   * @return {object}
   */
  _getStateTheme (state) {
    let theme = this.chassis.theme.getComponent(this.type)
    
		if (!theme || !theme.hasOwnProperty(state)) {
			return null
		}

		return theme[state]
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
    this.defaultSpec.states.forEach((state) => {
      let theme = this._getStateTheme(state)
      
      if (!theme || Object.keys(theme).length === 0) {
        return
      }
      
      this.linkOverrides.push({state, theme})
    })
  }
}

module.exports = ChassisComponent
