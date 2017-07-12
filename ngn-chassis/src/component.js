// TODO:
// - Handle component variants as component extensions

class ChassisComponent {
	constructor (chassis) {
		this.chassis = chassis
	}
	
	get rules () {
		let { settings } = this.chassis
		
		settings.componentResetSelectors = [
			...settings.componentResetSelectors,
			...this.selectors,
		]
		
		if (this.extensions) {
			settings.componentResetSelectors = [
				...settings.componentResetSelectors,
				...this.extensions,
			]
		}
		
		if (this.states && this.states.length > 0) {
			return this.states.map((state) => {
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
		let decls = theme.getComponentProperties(state)
		
		if (decls) {
			return Object.keys(decls).map((decl) => utils.css.newDeclObj(decl, decls[decl]))
		}
		
		return []
	}
	
	_decorateSelector (selector, pre, post) {
		if (pre) {
			selector = `${pre}${selector}`
		}

		if (post) {
			selector = `${selector}${post}`
		}
		
		if (this.hasOwnProperty('blacklist')) {
			this.blacklist.forEach((item) => {
				if (item.includes(' ')) {
					let arr = item.split(' ')
					item = arr.pop()
				}
				
				selector = `${selector}:not(${item})`
			})
		}

		return selector
	}
	
	generateSelectorList (pre, post) {
		let selectors = this.extensions ? [...this.selectors, ...this.extensions] : this.selectors
		
		return selectors.map((selector) => {
			if (selector.includes(' ')) {
				let arr = selector.split(' ')
				let firstMatch = arr.pop()
				
				arr.push(this._decorateSelector(firstMatch, pre, post))
				return arr.join(' ')
			}
			
			return this._decorateSelector(selector, pre, post)
			
		}).join(', ')
	}
}

module.exports = ChassisComponent
