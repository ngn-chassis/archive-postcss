// TODO:
// - Handle component variants as component extensions

class ChassisComponent {
	constructor (chassis, theme) {
		this.chassis = chassis
		this.theme = NGN.coalesce(theme, null)
	}

	get rules () {
		let { settings } = this.chassis

		settings.componentResetSelectors.push(...this.selectors)

		if (this.extensions) {
			settings.componentResetSelectors.push(...this.extensions)
		}

		if (this.states) {
			return Object.keys(this.states).map((state) => {
				let rule = this[state]

				if (rule.nodes.length > 0) {
					return rule
				}
			}).filter((rule) => rule !== undefined)
		}

		return this.default && this.default.nodes.length > 0 ? [this.default] : null
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

		// if (this.hasOwnProperty('blacklist')) {
		// 	let blacklisted = []
		//
		// 	this.blacklist.forEach((item) => {
		// 		if (item.includes(' ')) {
		// 			let arr = item.split(' ')
		// 			item = arr.pop()
		// 		}
		//
		// 		if (!blacklisted.includes(item)) {
		// 			blacklisted.push(item)
		// 			selector = `${selector}:not(${item})`
		// 		}
		// 	})
		// }

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
}

module.exports = ChassisComponent
