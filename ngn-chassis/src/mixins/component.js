const ChassisComponent = require('../component')

class ChassisComponentMixins {
	constructor (chassis) {
    this.chassis = chassis
		this.components = chassis.constants.components
  }
	
	extend () {
		let { componentExtensions, settings, utils } = this.chassis
		let { args, atRule, source } = arguments[0]
		let type = args[0]
		
		if (!this._componentExists(type)) {
			console.warn(`[WARNING] Line ${source.line}: Extensible component "${type}" not found. Discarding...`)
			atRule.remove()
			return
		}
		
		let selectors = atRule.parent.selector.split(',').map((selector) => selector.trim())
		
		if (componentExtensions.hasOwnProperty(type)) {
			componentExtensions[type].push(...selectors)
		} else {
			componentExtensions[type] = selectors
		}
		
		let spec = utils.css.newRule(atRule.parent.selector)
		spec.nodes = atRule.nodes
		
		let component = new ChassisComponent(this.chassis, type, utils.css.newRoot([spec]), true)
		
		// settings.componentResetSelectors[component.instance.resetType].push(...componentExtensions[type])
		
		atRule.parent.replaceWith(component.customRules)
	}
	
	include () {
		let { settings } = this.chassis
		let { args, atRule, source } = arguments[0]
		
		let requestedComponents = args.filter((component) => {
			let componentExists = this._componentExists(component)
		
			if (!componentExists) {
				console.warn(`[WARNING] Line ${source.line}: Component "${component}" not found.`)
			}
		
			return componentExists
		})
		
		// Order component includes for correct cascade behavior
		let sorted = []
		
		for (let [key, value] of this.components) {
			if (requestedComponents.includes(key)) {
				sorted.push(key)
			}
		}
		
		let css = sorted.map((type) => {
			let component = new ChassisComponent(this.chassis, type)
			
			settings.componentResetSelectors[component.instance.resetType].push(...component.defaultSpec.selectors)
			
			return component.themed
		})
		
		atRule.replaceWith(css)
	}
	
	new () {
		let { settings, theme, utils } = this.chassis
		let { args, atRule, source } = arguments[0]
		let type = args[0]
		
		if (!this._componentExists(type)) {
			console.warn(`[WARNING] Line ${source.line}: Chassis Component "${type}" not found. Discarding...`)
			atRule.remove()
			return
		}
		
		let spec = utils.css.newRule(atRule.parent.selector)
		spec.nodes = atRule.nodes
		
		let component = new ChassisComponent(this.chassis, type, utils.css.newRoot([spec]))
		
		settings.componentResetSelectors[component.instance.resetType].push(...atRule.parent.selector.split(','))
		
		atRule.parent.replaceWith(component.unthemed)
	}

	_componentExists (type) {
		return this.components.has(type)
	}
}

module.exports = ChassisComponentMixins
