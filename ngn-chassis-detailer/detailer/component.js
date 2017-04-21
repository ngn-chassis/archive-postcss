class DetailerComponent {
	constructor (project, config) {
		this.project = project
		this.config = config || {}
	}

	_generateSelector (selector, state) {
		if (state === 'default') {
			return selector
		}

		if (state === 'disabled') {
			return `${selector}.disabled`
		}

		return `${selector}:${state}`
	}

	_mergeProps (defaults, custom) {
		for (let state in custom.states) {
			if (!defaults.states.hasOwnProperty(state)) {
				defaults.states[state] = custom.states[state]
			}

			for (let property in custom.states[state]) {
				defaults.states[state][property] = custom.states[state][property]
			}
		}
		
		return defaults
	}

	generateStyles (properties) {
		let { config } = this

		if (config) {
			properties = this._mergeProps(properties, config)
		}

		let { utils } = this.project
		let root = utils.newRoot()

		let { states } = properties

		for (let state in states) {
			let selector = NGN.coalesce(config.selector, `.chassis ${properties.selector}`)

			let decls = Object.keys(states[state]).map((key) => {
				return utils.newDeclObj(key, states[state][key])
			})

			root.nodes.push(utils.newRule(this._generateSelector(selector, state),	decls))
		}

		return root
	}
}

module.exports = DetailerComponent
