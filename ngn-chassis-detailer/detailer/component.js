class ExtensibleComponent {
	constructor (project, spec, parent, customStates) {
		this.project = project
		this.spec = spec
		this.states = spec.nodes[0].nodes
		this.parent = NGN.coalesce(parent, null)

		if (customStates) {
			this._applyCustomStates(customStates)
		} else {
			this.selector = `.chassis ${this.spec.nodes[0].selector}`
		}
	}

	get styles () {
		let { utils } = this.project

		let rules = this.states.map(rule => {
			rule.selector = this._generateSelector(rule.selector)
			return rule
		})

		let output = utils.newRoot(rules)
		return this._processAtRules(output)
	}

	// Private Methods -----------------------------------------------------------
	_applyCustomStates (customStates) {
		this.selector = this.parent.selector

		customStates.forEach(customState => {
			let stateToReplace = this.states.find(state => {
				return state.selector === customState.selector
			})

			if (stateToReplace) {
				this._mergeProperties(stateToReplace, customState)
				return
			}

			this.states.push(customState)
		})
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

	_mergeProperties (spec, custom) {
		custom.walkDecls(decl => {
			let declToReplace = spec.nodes.find(node => {
				return node.type === 'decl' && node.prop === decl.prop
			})

			declToReplace = decl
		})
	}

	_processAtRules (input) {
		console.log(`TODO: Process component at-rules`);
		return input
	}
}

module.exports = ExtensibleComponent
