// TODO: Don't create ChassisSpecSheet for custom specs, just for default. Then,
// add a method to ChassisSpecSheet like "getCombinedSpec" or something which can
// have custom specs passed in, and return the combine stylesheet

const ChassisSpecSheet = require('./spec-sheet.js')
const ChassisStyleSheet = require('./style-sheet.js')

class ChassisComponent {
  constructor (chassis, type, customSpec) {
    this.chassis = chassis
    this.type = type
    
    this.instance = new (chassis.constants.components.get(type))(chassis)
    
    this.defaultSpec = new ChassisSpecSheet(this.chassis, type, chassis.utils.files.parseStyleSheet(`../components/${type}/spec.css`), this.instance.variables)
    // this.customSpec = customSpec ? new ChassisSpecSheet(this.chassis, type, customSpec, this.instance.variables) : null
    
    this.overridesLinks = this.instance.hasOwnProperty('overridesLinks') && this.instance.overridesLinks
    this.theme = chassis.theme.getComponent(type)
  }
  
  get unthemed () {
    let { utils } = this.chassis
    
    return this.defaultSpec.css
  }
  
  get themed () {
    // TODO: Theme needs to treat the components section as a group of spec sheets.
    // Here, we need to combine the defaultSpec with the theme spec.
  }
}

module.exports = ChassisComponent
