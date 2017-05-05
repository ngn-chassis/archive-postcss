class ExtensibleComponent {
	constructor (project, spec, customStates) {
		this.project = project
		this.spec = project.utils.parseStylesheet(`../../ngn-chassis-detailer/detailer/stylesheets/ui-components/${spec}.spec.css`)
		
		if (customStates) {
			this._applyCustomStates(customStates)
		} else {
			this.selector = `.chassis ${this.spec.nodes[0].selector}`
		}
	}
	
	get styles () {
		let { utils } = this.project
		let states = this.spec.nodes[0].nodes
		
		let rules = states.map(rule => {
			rule.selector = this._generateSelector(rule.selector)
			return rule
		})
		
		return utils.newRoot(rules)
	}
	
	// Private Methods -----------------------------------------------------------
	_applyCustomStates (customStates) {
		console.log('apply custom states');
		// let defaultStates = this.root.nodes[0].nodes
		// let customStates = this.config
		//
		// return customStates.map(customState => {
		// 	let defaultState = defaultStates.find(state => state.selector === customState.selector)
		//
		// 	if (defaultState) {
		// 		customState.nodes.forEach(customDecl => {
		// 			let defaultDecl = defaultState.nodes.find(node => node.prop === customDecl.prop)
		//
		// 			if (defaultDecl) {
		// 				defaultDecl.value = customDecl.value
		// 			}
		// 		})
		// 	}
		//
		// 	return defaultState
		// })
	}

	_generateSelector (state) {
		if (state === 'default') {
			return this.selector
		}
		
		// TODO: Check if state matches a CSS pseudo-class. If not, just append
		// the state to the selector as a classname. If so, add as a pseudo-class.
		
		if (state === 'disabled') {
			return `${this.selector}.disabled`
		}
		
		return `${this.selector}:${state}`
	}
}

module.exports = ExtensibleComponent
