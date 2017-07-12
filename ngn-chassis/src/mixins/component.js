const ChassisButtonComponent = require('../components/button.js')
const ChassisSvgIconComponent = require('../components/svg-icon.js')
const ChassisLinkComponent = require('../components/link.js')
const ChassisModalComponent = require('../components/modal.js')
const ChassisOverlayComponent = require('../components/overlay.js')
const ChassisTagComponent = require('../components/tag.js')

class ChassisComponentMixins {
	constructor (chassis) {
    this.chassis = chassis
		
		this.specs = {
			'button': ChassisButtonComponent,
			'link': ChassisLinkComponent,
			'modal': ChassisModalComponent,
			'overlay': ChassisOverlayComponent,
			'svg-icon': ChassisSvgIconComponent,
			'tag': ChassisTagComponent
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
		let { args, atRule, source } = arguments[0]
		let component = args[0]
		
		if (!this._componentExists(component)) {
			console.warn(`[WARNING] Line ${source.line}: Extensible component "${component}" not found. Discarding...`)
			atRule.remove()
			return
		}
		
		// TODO: Add atRule.parent.selector to root component selector list somehow
		
		atRule.replaceWith(atRule.nodes)
	}
}

module.exports = ChassisComponentMixins
