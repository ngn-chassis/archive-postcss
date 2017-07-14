// TODO:
// - Figure out which properties to apply to different component reset types
// - Generate custom properties from theme values for each component

class ChassisComponent {
	constructor (chassis, component, theme, selectors, states, extensions, resetType) {
		this.chassis = chassis
		this.name = component
		this.theme = NGN.coalesce(theme, null)
		this.selectors = selectors
		this.states = states
		this.extensions = extensions
		this.resetType = resetType
	}
	
	get css () {
		let { utils } = this.chassis
		return utils.css.newRoot(this.rules)
	}

	get rules () {
		let { settings, utils } = this.chassis

		settings.componentResetSelectors[this.resetType].push(...this.selectors)
		
		if (this.extensions) {
			settings.componentResetSelectors[this.resetType].push(...this.extensions)
		}
		
		if (Object.keys(this.states).length < 1) {
			console.error(`[ERROR] Chassis "${this.name}" component has no states.`)
			return null
		}

		let rules = Object.keys(this.states).map((state) => {
			let baseRule = utils.css.newRule(this.generateSelectorList(this.states[state]), this[state])
			let themeRule = utils.css.newRule(this.generateSelectorList(this.states[state]), this.getThemeDecls(state))
			let finalOutput = utils.css.newRoot([])

			if (state in this && baseRule.nodes.length > 0) {
				finalOutput.append(baseRule)
			}
			
			if (themeRule.nodes.length > 0) {
				finalOutput.append(themeRule)
			}
			
			return finalOutput
		}).filter((rule) => rule !== undefined)
		
		if (settings.legacy && 'legacy' in this) {
			rules.push(this.legacy)
		}
		
		return rules
	}
	
	_decorateSelector (selector, decorators) {
		if (decorators) {
			if (Array.isArray(decorators)) {
				selector = decorators.map((decorator) => {
					return `${selector}${decorator}`
				}).join(', ')

			} else {
				selector = `${selector}${decorators}`
			}
		}

		return selector
	}
	
	generateSelectorList (decorators, selectors = this.selectors, extending = false) {
		if (!extending) {
			selectors = this.extensions ? [...selectors, ...this.extensions] : selectors
		}

		return selectors.map((selector) => {
			if (selector.includes(' ')) {
				let arr = selector.split(' ')
				let firstMatch = arr.pop()

				arr.push(this._decorateSelector(firstMatch, decorators))
				return arr.join(' ')
			}

			return this._decorateSelector(selector, decorators)

		}).join(', ')
	}

	getThemeDecls (state) {
		let { theme, utils } = this.chassis
		let decls = this.getStateProperties(state)
	
		if (decls) {
			return Object.keys(decls).map((decl) => utils.css.newDeclObj(decl, decls[decl]))
		}
	
		return []
	}
	
	getStateProperties (state) {
		if (!this.theme) {
			return []
		}
		
		if (state === 'default') {
			let defaults = {}
			
			for (let prop in this.theme) {
				if (typeof this.theme[prop] === 'string') {
					defaults[prop] = this.theme[prop]
				}
			}
			
			return defaults
		}

		if (this.theme.hasOwnProperty(state)) {
			return this.theme[state]
		}

		// console.info(`[INFO] ${this.filename} does not contain theming information for "${component}" component. Using default styles...`)
		return null
	}
}

module.exports = ChassisComponent
