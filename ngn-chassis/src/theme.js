const postcss = require('postcss')
const customProperties = require('postcss-custom-properties')

class ChassisTheme {
	constructor (chassis) {
		this.chassis = chassis
		this.rules = []

		this.filename = chassis.utils.files.getFileName(chassis.settings.theme)

		let pathIsAbsolute = chassis.utils.files.pathIsAbsolute(chassis.settings.theme)

		this.tree = chassis.utils.files.parseStyleSheet(chassis.settings.theme, !pathIsAbsolute)
		this.components = []

		this.hasCustomProperties = this.tree.some((rule) => rule.selector === 'custom-properties')
		this.hasRootBlock = this.tree.some((rule) => rule.selector === ':root')

		this._generateRules()
		this.json = this._generateJson()
	}

	applyToComponent (component, defaultRules, state, root) {
		let { utils } = this.chassis
		let {
			name,
			theme,
			selectors,
			subcomponents
		} = component

		if (!theme || !theme[state]) {
			return root.append(...defaultRules)
		}

		let propKeys = Object.keys(theme[state].properties)
		let ruleKeys = Object.keys(theme[state].rules)

		if (propKeys.length > 0) {
			if (defaultRules.length === 0) {
				defaultRules.push(utils.css.newRule(selectors.join(', ')))
			}

			let defaultRule = defaultRules[0]
			let decls = []

			for (let property in theme[state].properties) {
				decls.push(utils.css.newDecl(property, theme[state].properties[property]))
			}

			defaultRule.nodes = utils.css.mergeDecls(defaultRule.nodes, decls)
		}

		root.append(...defaultRules)

		if (ruleKeys.length > 0) {
			let rulesets = this.appendNestedRulesets(root, selectors, theme[state].rules)
		}

		return root
	}

	applyToElement (element, defaultRule, root = this.chassis.utils.css.newRoot([])) {
		let { utils } = this.chassis

		let selectors = defaultRule.selector.split(',').map((selector) => selector.trim())
		let theme = this.getElement(element)

		if (!theme) {
			return root.append(defaultRule)
		}

		let propKeys = Object.keys(theme.properties)
		let ruleKeys = Object.keys(theme.rules)

		if (propKeys.length > 0) {
			let decls = []

			for (let property in theme.properties) {
				decls.push(utils.css.newDecl(property, theme.properties[property]))
			}

			defaultRule.nodes = utils.css.mergeDecls(defaultRule.nodes, decls)
		}

		root.append(defaultRule)

		if (ruleKeys.length > 0) {
			let rulesets = this.appendNestedRulesets(root, selectors, theme.rules)
		}

		return root
	}

	appendNestedRulesets (root, selectors, nestedRules) {
		let { utils } = this.chassis

		Object.keys(nestedRules).forEach((nestedRule) => {
			let nestedSelector = selectors.map((selector) => `${selector} ${nestedRule}`).join(', ')
			let { properties, rules } = nestedRules[nestedRule]

			let decls = Object.keys(properties).map((property) => {
				return utils.css.newDeclObj(property, properties[property])
			})

			root.append(utils.css.newRule(nestedSelector, decls))

			if (Object.keys(rules).length > 0) {
				this.appendNestedRulesets(root, [nestedSelector], rules)
			}
		})
	}

	componentSelectorIsValid (component) {
		let hasCommas = component.selector.includes(',')
		let numIssues = 0

		if (hasCommas) {
			numIssues++
			console.warn(`[WARNING]: ${this.filename} line ${component.source.start.line}: Chassis Themes do not support comma-separated component selectors. Discarding...`)
		}

		return numIssues === 0
	}

	getComponent (component) {
		if (!this.json.components.hasOwnProperty(component)) {
			return null
		}

		return this.json.components[component]
	}

	generateComponentJson (component) {
		let json = {
			default: {}
		}

		component.nodes.forEach((node) => {
			if (node.type === 'comment') {
				return
			} else if (node.type === 'decl') {
				let { prop, value } = node

				console.warn(`[WARNING]: ${this.filename} line ${node.source.start.line}: "${component.selector}" component: Theme properties must be assigned to a component state or an element selector. Discarding unassigned "${node.prop}" property...`)
				return
			} else if (node.type === 'atrule') {
				let state = node.params

				if (state === 'variants') {
					json.variants = this._generateComponentVariantJson(node)
					return
				}

				json[state] = this._generateComponentStateJson(node)
				return
			}

			console.warn(`[WARNING]: ${this.filename} line ${node.source.start.line}: Chassis Themes do not support nodes of type "${node.type}". Discarding...`)
		})

		return json
	}

	getComponentProperties (component) {
		if (!this.json.components.hasOwnProperty(component)) {
			return null
		}

		return this.json.components[component]
	}

	getComponentStateProperties (component) {
		let state = 'default'

		if (component.includes('.')) {
			let arr = component.split('.')
			component = arr[0]
			state = arr[1]
		}

		if (!this.json.hasOwnProperty(component)) {
			return null
		}

		let props = this.json[component]

		if (state === 'default') {
			let defaults = {}

			for (let prop in props) {
				if (typeof props[prop] === 'string') {
					defaults[prop] = props[prop]
				}
			}

			return defaults
		}

		if (props.hasOwnProperty(state)) {
			return this.json[component][state]
		}

		// console.info(`[INFO] ${this.filename} does not contain theming information for "${component}" component. Using default styles...`)
		return null
	}

	getCustomProperties () {
		return this.json['custom-properties']
	}

	getElement (element) {
		if (!this.json.elements.hasOwnProperty(element)) {
			return null
		}

		return this.json.elements[element]
	}

	hasComponent (component) {
		return this.components.includes(component)
	}

	// Private Methods -----------------------------------------------------------

	_generateComponentStateJson (state) {
		let json = {
			properties: {},
			rules: {}
		}

		state.nodes.forEach((node) => {
			if (node.type === 'comment') {
				return

			} else if (node.type === 'rule') {
				json.rules[node.selector] = this._generateRulesetJson(node)
				return

			} else if (node.type !== 'decl') {
				console.warn(`[WARNING]: ${this.filename} line ${node.source.start.line}: Chassis Themes: Component states do not support nodes of type "${node.type}". Discarding...`)
				node.remove()
				return
			}

			json.properties[node.prop] = node.value
		})

		return json
	}

	_generateComponentVariantJson (variant) {
		let json = {}

		variant.nodes.forEach((node) => {
			if (node.type === 'comment') {
				return

			} else if (node.type !== 'rule') {
				console.warn(`[WARNING]: ${this.filename} line ${node.source.start.line}: Invalid Component Variant type "${node.type}". Component Variants must be declared as rulesets with CSS declarations inside. Discarding...`)
				node.remove()
				return
			}

			json[node.selector] = this.generateComponentJson(node)
		})

		return json
	}

	_generateCustomProperties (root) {
		let json = {}

		root.nodes.forEach((node) => {
			json[node.prop] = node.value
		})

		return json
	}

	_generateJson () {
		let json = {
			components: {},
			elements: {}
		}

		this.tree.nodes.forEach((node) => {
			if (node.selector === 'components') {
				let components = node.nodes

				components.forEach((component) => {
					if (component.type === 'comment') {
						return
					}

					if (!this.componentSelectorIsValid(component)) {
						return
					}

					json.components[component.selector] = this.generateComponentJson(component)
				})

				return
			}

			if (node.selector === ':root' || node.selector === 'custom-properties') {
				json[node.selector] = this._generateCustomProperties(node)
				return
			}

			json.elements[node.selector] = this._generateRulesetJson(node)
		})

		return json
	}

	_generateRules () {
		let { utils } = this.chassis

		this.tree.walkRules((rule) => {
			if (rule.selector === 'custom-properties' && !this.hasRootBlock) {
				rule.cloneBefore(rule.clone({selector: ':root'}))
			}

			if (rule.selector === ':root' && !this.hasCustomProperties) {
				rule.cloneAfter(rule.clone({selector: 'custom-properties'}))
			}

			if (rule.selector === 'variants' || rule.parent.selector === 'variants') {
				return
			}

			if (rule.parent.type === 'root') {
				if (this.rules.includes(rule.selector)) {
					console.warn(`[WARNING] ${this.filename} line ${rule.source.start.line}: Duplicate selector "${rule.selector}". Discarding...`)
					rule.remove()
					return
				}

				this.components.push(rule.selector)
			}

			this.rules.push(rule.selector)
		})
	}

	_generateRulesetJson (ruleset) {
		let json = {
			properties: {},
			rules: {}
		}

		ruleset.nodes.forEach((node) => {
			if (node.type === 'comment') {
				return

			} else if (node.type === 'rule') {
				json.rules[node.selector] = this._generateRulesetJson(node)
				return

			} else if (node.type !== 'decl') {
				console.warn(`[WARNING]: ${this.filename} line ${node.source.start.line}: Chassis Themes: Rulesets nested within component states do not support nodes of type "${node.type}". Discarding...`)
				node.remove()
				return
			}

			json.properties[node.prop] = node.value
		})

		return json
	}
}

module.exports = ChassisTheme
