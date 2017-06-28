class ChassisTheme {
	constructor (chassis) {
		this.chassis = chassis
		this.rules = []
		
		this.filename = chassis.utils.files.getFileName(chassis.settings.theme)
		
		let pathIsAbsolute = chassis.utils.files.pathIsAbsolute(chassis.settings.theme)
		
		this.tree = chassis.utils.files.parseStylesheet(chassis.settings.theme, !pathIsAbsolute)
		
		this.tree.walkRules((rule) => {
			if (this.rules.includes(rule.selector)) {
				console.warn(`[WARNING] ${this.filename} line ${rule.source.start.line}: Duplicate selector "${rule.selector}". Discarding...`)
				rule.remove()
				return
			}
			
			this.rules.push(rule.selector)
		})
	}
	
	get asJson () {
		let json = {}
		
		this.tree.nodes.forEach((rule) => {
			if (rule.selector.includes(',')) {
				console.warn(`[WARNING]: ${this.filename} line ${rule.source.start.line}: Chassis Themes do not support comma-separated rule selectors. Discarding...`)
				return
			}
			
			json[rule.selector] = {}
			
			rule.nodes.forEach((node) => {
				if (node.type === 'decl') {
					json[rule.selector][node.prop] = node.value
					return
				}
				
				if (node.type === 'rule') {
					json[rule.selector][node.selector] = {}
					
					node.nodes.forEach((nestedNode) => {
						if (nestedNode.type !== 'decl') {
							console.warn(`[WARNING]: ${this.filename} line ${node.source.start.line}: Chassis Themes do not support nested rules within component states. Discarding...`)
							nestedNode.remove()
							return
						}
						
						 json[rule.selector][node.selector][nestedNode.prop] = nestedNode.value
					})
					
					return
				}
				
				console.warn(`[WARNING]: ${this.filename} line ${node.source.start.line}: Chassis Themes do not currently support nodes of type "${node.type}". Discarding...`)
			})
		})
		
		return json
	}
	
	getComponentProperties(component) {
		let json = this.asJson
		let state = 'default'
		
		if (component.includes('.')) {
			let arr = component.split('.')
			component = arr[0]
			state = arr[1]
		}
		
		if (!json.hasOwnProperty(component)) {
			return null
		}
		
		let props = json[component]
		
		if (state === 'default') {
			let defaults = {}
			
			Object.keys(props).forEach((prop) => {
				if (typeof props[prop] === 'string') {
					defaults[prop] = props[prop]
				}
			})
			
			return defaults
		}
		
		if (props.hasOwnProperty(state)) {
			return json[component][state]
		}
		
		// console.info(`[INFO] ${this.filename} does not contain theming information for "${component}" component. Using default styles...`)
		return null
	}
}

module.exports = ChassisTheme
