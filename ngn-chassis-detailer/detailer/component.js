class ExtensibleComponent {
	constructor (project, basePath, component, parent, customStates) {
		this.project = project
		this.filepath = `${basePath}/extensible/${component}.spec.css`
		this.fileExists = this.project.utils.fileExists(this.filepath)

		if (!this.fileExists) {
			console.error(`Detailer Component "${component}" is not extensible.`)
		}

		this.name = component
		this.spec = project.utils.parseStylesheet(this.filepath)
		this.parent = NGN.coalesce(parent, null)

		if (customStates) {
			this._applyCustomStates(customStates)
		} else {
			this.selector = `.chassis ${this.spec.nodes[0].selector}`
		}
	}

	get isExtensible () {
		return this.fileExists
	}

	get styles () {
		let { utils } = this.project
		let states = this.spec.nodes[0].nodes

		let rules = states.map(rule => {
			rule.selector = this._generateSelector(rule.selector)
			return rule
		})

		let output = utils.newRoot(rules)

		return this._processAtRules(output)
	}

	// Private Methods -----------------------------------------------------------
	_applyCustomStates (customStates) {
		console.log(`TODO: apply custom states to ${this.name} component`);
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

	_processAtRules (input) {
		console.log(`TODO: Process ${this.name} component at-rules`);
		return input
	}
}

module.exports = ExtensibleComponent
