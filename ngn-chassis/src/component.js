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
    
    this.defaultSpec = new ChassisSpecSheet(this.chassis, type, chassis.utils.files.parseStyleSheet(`../components/${type}/spec.css`), this.instance.variables)
    this.customSpec = customSpec
    
    this.overridesLinks = this.instance.hasOwnProperty('overridesLinks') && this.instance.overridesLinks
    this.theme = chassis.theme.getComponentSpec(type)
  }
  
  get customRules () {
    if (!this.customSpec) {
      return null
    }
    
    return this.defaultSpec.getCustomizedCss(this.customSpec)
  }
  
  get unthemed () {
    if (!this.customSpec) {
      return this.defaultSpec.css
    }
    
    return this.defaultSpec.getUnthemedCss(this.customSpec)
  }
  
  get themed () {
    if (!this.theme) {
      return this.defaultSpec.css
    }
    
    return this.defaultSpec.getThemedCss(this.theme)
  }
}

module.exports = ChassisComponent
