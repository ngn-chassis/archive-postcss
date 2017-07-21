const postcss = require('postcss')
const customProperties = require('postcss-custom-properties')

class ChassisTheme {
	constructor (chassis) {
		this.chassis = chassis
		this.rules = []
		this.components = []

		this.filename = chassis.utils.files.getFileName(chassis.settings.theme)

		let pathIsAbsolute = chassis.utils.files.pathIsAbsolute(chassis.settings.theme)

		this.tree = chassis.utils.files.parseStyleSheet(chassis.settings.theme, !pathIsAbsolute)

		this.hasCustomProperties = this.tree.some((rule) => rule.selector === 'custom-properties')
		this.hasRootBlock = this.tree.some((rule) => rule.selector === ':root')
		
		this._initialize()
	}
	
	get customProperties () {
		return this.json['custom-properties']
	}
	
	get json () {
		return this.chassis.utils.theme.generateJson(this.tree)
	}
	
	getElement (element) {
		if (!this.json.elements.hasOwnProperty(element)) {
			// TODO: Add Warning/Error message
			return null
		}
	
		return this.json.elements[element]
	}
	
	getComponent (component) {
		if (!this.json.components.hasOwnProperty(component)) {
			// TODO: Add Warning/Error message
			return null
		}
	
		return this.json.components[component]
	}
	
	
	_initialize () {
		this.tree.walkRules((rule) => {
			if (rule.selector === 'custom-properties' && !this.hasRootBlock) {
				rule.cloneBefore(rule.clone({selector: ':root'}))
			}

			if (rule.selector === ':root' && !this.hasCustomProperties) {
				rule.cloneAfter(rule.clone({selector: 'custom-properties'}))
			}

			if (rule.parent.type === 'root') {
				if (this.rules.includes(rule.selector)) {
					// TODO: Instead of discarding duplicates, attempt to merge properties
					console.warn(`[WARNING] ${this.filename} line ${rule.source.start.line}: Duplicate selector "${rule.selector}". Discarding...`)
					rule.remove()
					return
				}

				this.components.push(rule.selector)
			}

			this.rules.push(rule.selector)
		})
	}
	
	// generateRules (theme) {
	// 	if (!theme.hasOwnProperty('rules')) {
	// 		return []
	// 	}
	//
	// 	let { utils } = this.chassis
	//
	// 	return Object.keys(theme.rules).map((rule) => {
	// 		console.log(rule);
	//
	// 		return rule
	// 	})
	// }

	// hasComponent (component) {
	// 	return this.components.includes(component)
	// }
}

module.exports = ChassisTheme

// getComponentStateProperties (component) {
// 	let state = 'default'
//
// 	if (component.includes('.')) {
// 		let arr = component.split('.')
// 		component = arr[0]
// 		state = arr[1]
// 	}
//
// 	if (!this.json.hasOwnProperty(component)) {
// 		return null
// 	}
//
// 	let props = this.json[component]
//
// 	if (state === 'default') {
// 		let defaults = {}
//
// 		for (let prop in props) {
// 			if (typeof props[prop] === 'string') {
// 				defaults[prop] = props[prop]
// 			}
// 		}
//
// 		return defaults
// 	}
//
// 	if (props.hasOwnProperty(state)) {
// 		return this.json[component][state]
// 	}
//
// 	// console.info(`[INFO] ${this.filename} does not contain theming information for "${component}" component. Using default styles...`)
// 	return null
// }
