const ChassisButtonComponent = require('../components/button.js')
const ChassisLinkComponent = require('../components/link.js')
const ChassisTagComponent = require('../components/tag.js')

class ChassisComponentMixins {
	constructor (chassis) {
    this.chassis = chassis
		
		this.specs = {
			button: ChassisButtonComponent,
			link: ChassisLinkComponent,
			tag: ChassisTagComponent
		}
  }
	
	_componentExists (component) {
		return Object.keys(this.specs).includes(component)
	}
	
	include () {
		let { args, atRule, source } = arguments[0]
	
		let css = args.map((component) => {
			if (this._componentExists(component)) {
				return new this.specs[component](this.chassis).css
			}
		
			console.warn(`[WARNING] Line ${source.line}: Component "${component}" not found.`)
			return
		}).filter((entry) => entry !== undefined)
		
		atRule.replaceWith(css)
	}
	
	extend () {
		console.log(`extending`);
	}
}

module.exports = ChassisComponentMixins
