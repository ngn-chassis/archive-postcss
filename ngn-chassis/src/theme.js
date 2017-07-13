const postcss = require('postcss')
const customProperties = require('postcss-custom-properties')

class ChassisTheme {
	constructor (chassis) {
		this.chassis = chassis
		this.rules = []

		this.filename = chassis.utils.files.getFileName(chassis.settings.theme)

		let pathIsAbsolute = chassis.utils.files.pathIsAbsolute(chassis.settings.theme)

		this.tree = chassis.utils.files.parseStylesheet(chassis.settings.theme, !pathIsAbsolute)
		this.components = []
		
		this.hasCustomProperties = this.tree.some((rule) => rule.selector === 'custom-properties')
		this.hasRootBlock = this.tree.some((rule) => rule.selector === ':root')
		
		this._generateRules()
		this.json = this._generateJson()
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
	
	getComponentProperties (component) {
		if (!this.json.hasOwnProperty(component)) {
			return null
		}
		
		return this.json[component]
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

	hasComponent (component) {
		return this.components.includes(component)
	}
	
	_generateComponentJson (component) {
		let json = {}

		component.nodes.forEach((node) => {
			if (node.type === 'comment') {
				return
			}

			if (node.type === 'decl') {
				let { prop, value } = node
				json[prop] = value
				return
			}

			if (node.type === 'rule') {
				let state = node.selector

				if (state === 'variants') {
					json.variants = this._generateComponentVariantJson(node)
					return
				}

				json[state] = this._generateComponentStateJson(node)
				return
			}

			console.warn(`[WARNING]: ${this.filename} line ${componentNode.source.start.line}: Chassis Themes do not support nodes of type "${componentNode.type}". Discarding...`)
		})

		return json
	}
	
	_generateComponentStateJson (state) {
		let json = {}

		state.nodes.forEach((node) => {
			if (node.type === 'comment') {
				return
			} else if (node.type !== 'decl') {
				console.warn(`[WARNING]: ${this.filename} line ${node.source.start.line}: Chassis Themes do not support nested rulesets within component states. Discarding...`)
				node.remove()
				return
			}

			json[node.prop] = node.value
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

			let variant = node.selector
			json[variant] = this._generateComponentJson(node)
		})

		return json
	}

	_generateJson () {
		let json = {}

		this.tree.nodes.forEach((component) => {
			if (!this.componentSelectorIsValid(component)) {
				return
			}

			let componentName = component.selector
			json[componentName] = this._generateComponentJson(component)
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
}

module.exports = ChassisTheme
