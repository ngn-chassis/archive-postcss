const ChassisComponent = require('../component')

class ChassisComponentMixins {
	constructor (chassis) {
    this.chassis = chassis
		this.components = chassis.constants.components
  }
	
	new () {
		let { theme, utils } = this.chassis
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
		
		atRule.parent.replaceWith(component.unthemed)
	}
	
	include () {
		// let { args, atRule, source } = arguments[0]
		//
		// let requestedComponents = args.filter((component) => {
		// 	let componentExists = this._componentExists(component)
		//
		// 	if (!componentExists) {
		// 		console.warn(`[WARNING] Line ${source.line}: Component "${component}" not found.`)
		// 	}
		//
		// 	return componentExists
		// })
 	//
		// // Order component includes for correct cascade behavior
		// requestedComponents.sort((a, b) => {
		//   return this._getIndex(a) > this._getIndex(b) ? 1 : -1;
		// });
		//
		// let css = requestedComponents.map((name) => {
		// 	let Component = this.get(name)
		// 	return new Component(this.chassis).css
		// })
		//
		// atRule.replaceWith(css)
	}
	
	extend () {
		// let { componentExtensions, utils } = this.chassis
		// let { args, atRule, source } = arguments[0]
		// let name = args[0]
		//
		// if (!this._componentExists(name)) {
		// 	console.warn(`[WARNING] Line ${source.line}: Extensible component "${name}" not found. Discarding...`)
		// 	atRule.remove()
		// 	return
		// }
		//
		// let selectors = atRule.parent.selector.split(',').map((selector) => selector.trim())
		//
		// if (componentExtensions.hasOwnProperty(name)) {
		// 	componentExtensions[name].push(...selectors)
		// } else {
		// 	componentExtensions[name] = selectors
		// }
		//
		// let Extension = this.get(name)
		// let component = new Extension(this.chassis)
		//
		// let componentStates = []
		// component.spec.walkAtRules('state', (atRule) => {
		// 	componentStates.push(atRule)
		// })
		//
		// let root = utils.css.newRoot([])
		//
		// // Loop over each state and generate rules
		// atRule.nodes.forEach((node) => {
		// 	if (node.type !== 'atrule') {
		// 		console.warn(`[WARNING] Line ${source.line}: Component extensions must contain only @state rules. Discarding...`)
		// 		node.remove()
		// 		return
		// 	}
		//
		// 	let state = node.params
		//
		// 	if (!componentStates.some((componentState) => componentState.params === state)) {
		// 		console.warn(`[WARNING] Line ${source.line}: "${state}" state is not supported by "${component.name}" component. Discarding extensions...`)
		// 		node.remove()
		// 		return
		// 	}
		//
		// 	let matchingRules = [...componentStates.find((componentState) => componentState.params === state).nodes]
		//
		// 	let stateSelector = selectors.map((selector) => {
		// 		return utils.string.resolveVariables(matchingRules[0].selector, {selector})
		// 	}).join(', ')
		//
		// 	// Handle nested rules
		// 	node.nodes.forEach((innerNode) => {
		// 		if (innerNode.type === 'rule') {
		// 			let selectorList = stateSelector.split(',').map((selector) => `${selector} ${innerNode.selector}`).join(', ')
		//
		// 			root.prepend(utils.css.newRule(selectorList, innerNode.nodes))
		// 			innerNode.remove()
		// 			return
		// 		}
		// 	})
		//
		// 	root.append(utils.css.newRule(stateSelector, node.nodes))
		// })
		//
		// atRule.parent.replaceWith(root)
	}

	_componentExists (type) {
		return this.components.has(type)
	}
}

module.exports = ChassisComponentMixins
