class ChassisComponentMixins {
	constructor (chassis) {
    this.chassis = chassis
		this.components = chassis.constants.components
  }

	get (name) {
		let component = this.components.find((component) => component.name === name)
		return component ? component.spec : null
	}

	include () {
		let { args, atRule, source } = arguments[0]

		let components = args.filter((component) => {
			let componentExists = this._componentExists(component)
		
			if (!componentExists) {
				console.warn(`[WARNING] Line ${source.line}: Component "${component}" not found.`)
			}
		
			return componentExists
		})
 		
		// Order component includes for correct cascade behavior
		components.sort((a, b) => {
		  return this._getIndex(a) > this._getIndex(b) ? 1 : -1;
		});
		
		let css = components.map((name) => {
			if (this._componentExists(name)) {
				let Component = this.get(name)
				
				return new Component(this.chassis).css
			}
			
			console.warn(`[WARNING] Line ${source.line}: Component "${name}" not found.`)
			return
		}).filter((entry) => entry !== undefined)
		
		atRule.replaceWith(css)
	}
	
	extend () {
		let { extensions, utils } = this.chassis
		let { args, atRule, source } = arguments[0]
		let name = args[0]
		
		if (!this._componentExists(name)) {
			console.warn(`[WARNING] Line ${source.line}: Extensible component "${name}" not found. Discarding...`)
			atRule.remove()
			return
		}
		
		if (extensions.hasOwnProperty(name)) {
			extensions[name].push(atRule.parent.selector)
		} else {
			extensions[name] = [atRule.parent.selector]
		}
		
		let Component = this.get(name)
		let instance = new Component(this.chassis, atRule.nodes)
		
		let decls = instance.getDiffedDecls()
		// TODO: In component.js, diff the custom spec against the default component
		// styles and return the decls to apply to the component extension
		
		atRule.parent.replaceWith(utils.css.newRoot([]))
	}
	
	// extend () {
	// 	let { extensions, utils } = this.chassis
	// 	let { args, atRule, source } = arguments[0]
	// 	let name = args[0]
	//
	// 	if (!this._componentExists(name)) {
	// 		console.warn(`[WARNING] Line ${source.line}: Extensible component "${name}" not found. Discarding...`)
	// 		atRule.remove()
	// 		return
	// 	}
	//
	// 	if (extensions.hasOwnProperty(name)) {
	// 		extensions[name].push(atRule.parent.selector)
	// 	} else {
	// 		extensions[name] = [atRule.parent.selector]
	// 	}
	//
	// 	let Component = this.get(name)
	// 	let instance = new Component(this.chassis)
	//
	// 	let root = utils.css.newRoot([
	// 		utils.css.newRule(atRule.parent.selector, atRule.nodes.map((node) => {
	// 			if (node.type === 'decl') {
	// 				return node
	// 			}
	//
	// 			return
	// 		}).filter((entry) => entry !== undefined))
	// 	])
	//
	// 	atRule.nodes.forEach((node) => {
	// 		if (node.type === 'rule') {
	// 			let state = node.selector
	//
	// 			if (!(state in instance.states)) {
	// 				// TODO: Add link to proper documentation!
	// 				console.warn(`[WARNING] Line ${source.line}: Chassis extend mixin cannot accept nested rulesets. Please see documentation for formatting. Discarding...`)
	// 				node.remove()
	// 				return
	// 			}
	//
	// 			let selector = instance.generateSelectorList(instance.states[state], [atRule.parent.selector], true)
	// 			root.append(utils.css.newRule(selector, node.nodes))
	// 		}
	// 	})
	//
	// 	atRule.parent.replaceWith(root)
	// }

	// new () {
	// 	let { theme, utils } = this.chassis
	// 	let { args, atRule, source } = arguments[0]
	// 	let name = args[0]
	//
	// 	if (!this._componentExists(name)) {
	// 		console.warn(`[WARNING] Line ${source.line}: Extensible component "${name}" not found. Discarding...`)
	// 		atRule.remove()
	// 		return
	// 	}
	//
	// 	let Component = this.get(name)
	// 	let component = new Component(this.chassis, theme.generateComponentJson(atRule), [atRule.parent.selector])
	//
	// 	atRule.parent.replaceWith(component.css)
	// }
	//
	// extend () {
	// 	let { extensions, utils } = this.chassis
	// 	let { args, atRule, source } = arguments[0]
	// 	let name = args[0]
	//
	// 	if (!this._componentExists(name)) {
	// 		console.warn(`[WARNING] Line ${source.line}: Extensible component "${name}" not found. Discarding...`)
	// 		atRule.remove()
	// 		return
	// 	}
	//
	// 	if (extensions.hasOwnProperty(name)) {
	// 		extensions[name].push(atRule.parent.selector)
	// 	} else {
	// 		extensions[name] = [atRule.parent.selector]
	// 	}
	//
	// 	let Component = this.get(name)
	// 	let instance = new Component(this.chassis)
	//
	// 	let root = utils.css.newRoot([
	// 		utils.css.newRule(atRule.parent.selector, atRule.nodes.map((node) => {
	// 			if (node.type === 'decl') {
	// 				return node
	// 			}
	//
	// 			return
	// 		}).filter((entry) => entry !== undefined))
	// 	])
	//
	// 	atRule.nodes.forEach((node) => {
	// 		if (node.type === 'rule') {
	// 			let state = node.selector
	//
	// 			if (!(state in instance.states)) {
	// 				// TODO: Add link to proper documentation!
	// 				console.warn(`[WARNING] Line ${source.line}: Chassis extend mixin cannot accept nested rulesets. Please see documentation for formatting. Discarding...`)
	// 				node.remove()
	// 				return
	// 			}
	//
	// 			let selector = instance.generateSelectorList(instance.states[state], [atRule.parent.selector], true)
	// 			root.append(utils.css.newRule(selector, node.nodes))
	// 		}
	// 	})
	//
	// 	atRule.parent.replaceWith(root)
	// }

	_componentExists (name) {
		return this.components.some((component) => component.name === name)
	}

	_getIndex (name) {
		return this.components.findIndex((component) => component.name === name)
	}
}

module.exports = ChassisComponentMixins
