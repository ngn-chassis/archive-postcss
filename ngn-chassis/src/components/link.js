const ChassisComponent = require('../component')

class ChassisLinkComponent extends ChassisComponent {
	constructor	(chassis) {
		super(chassis)

		this.states = [
			'default',
			'visited',
			'hover',
			'active',
			'disabled',
			'focus'
		]
		
		this.selectors = ['a']
		this.extensions = NGN.coalesce(chassis.extensions.link, null)
		
		this.blacklist = ['.button']
		
		if (chassis.extensions.hasOwnProperty('button')) {
			this.blacklist = [...this.blacklist, ...chassis.extensions.button]
		}
	}

	get css () {
		let { settings, utils } = this.chassis
		let { rules } = this

		return utils.css.newRoot(rules)
	}

	get default () {
		let { utils } = this.chassis

		return utils.css.newRule(this.generateSelectorList(), [
			...this.getThemeDecls('a')
		])
	}

	get visited () {
		let { utils } = this.chassis

		return utils.css.newRule(this.generateSelectorList(null, ':visited'), [
			...this.getThemeDecls('a.visited')
		])
	}

	get hover () {
		let { utils } = this.chassis

		return utils.css.newRule(this.generateSelectorList(null, ':hover'), [
			...this.getThemeDecls('a.hover')
		])
	}

	get active () {
		let { utils } = this.chassis

		return utils.css.newRule(this.generateSelectorList(null, ':active'), [
			...this.getThemeDecls('a.active')
		])
	}

	get disabled () {
		let { utils } = this.chassis

		return utils.css.newRule(`${this.generateSelectorList(null, '[disabled]')}, ${this.generateSelectorList(null, '.disabled')}`, [
			utils.css.newDeclObj('cursor', 'default'),
			utils.css.newDeclObj('pointer-events', 'none'),
			...this.getThemeDecls('a.disabled')
		])
	}

	get focus () {
		let { utils } = this.chassis

		return utils.css.newRule(this.generateSelectorList(null, ':focus'), [
			...this.getThemeDecls('a.focus')
		])
	}
}

module.exports = ChassisLinkComponent
