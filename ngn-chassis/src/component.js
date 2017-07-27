const ChassisSpecSheet = require('./spec-sheet.js')
const ChassisStyleSheet = require('./style-sheet.js')

class ChassisComponent {
  constructor (chassis, type, customSpec) {
    this.chassis = chassis
    this.type = type
    
    this.instance = new (chassis.constants.components.get(type))(chassis)
    
    this.defaultSpec = new ChassisSpecSheet(this.chassis, chassis.utils.files.parseStyleSheet(`../components/${type}/spec.css`))
    this.customSpec = customSpec ? new ChassisSpecSheet(this.chassis, customSpec) : null
    
    this.overridesLinks = this.instance.hasOwnProperty('overridesLinks') && this.instance.overridesLinks
    this.theme = chassis.theme.getComponent(type)
  }
  
  get unthemed () {
    let { utils } = this.chassis
    
    
    
    return ''
  }
  
  get themed () {
    // TODO: Theme needs to treat the components section as a group of spec sheets.
    // Here, we need to combine the defaultSpec with the theme spec.
  }
}

module.exports = ChassisComponent
