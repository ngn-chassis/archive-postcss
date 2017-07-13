const ChassisComponent = require('../component')

class ChassisLinkComponent extends ChassisComponent {
	constructor	(chassis, theme) {
		super(chassis, theme)

		this.states = {
			'default': [''],
			'visited': [':visited'],
			'hover': [':hover'],
			'active': [':active'],
			'disabled': ['[disabled]', '.disabled'],
			'focus': [':focus']
		}
		
		this.selectors = ['a']
		this.extensions = NGN.coalesce(chassis.extensions.link, null)
		
		// All decls applied to <a> tags. These will be unset or overridden on
		// other components that use <a> tags in conjunction with a class or attr
		this.declGroups = []
	}

	get css () {
		let { linkOverrides, settings, utils } = this.chassis
		let { rules } = this
		
		this.chassis.linkOverrides = this.declGroups

		return utils.css.newRoot(rules)
	}

	get default () {
		let { utils } = this.chassis
		let themeDecls = this.getThemeDecls('default')
		
		this.declGroups.push({
			state: 'default',
			decls: [...themeDecls]
		})
		
		return utils.css.newRule(this.generateSelectorList(), [
			...themeDecls
		])
	}

	get visited () {
		let { utils } = this.chassis
		let themeDecls = this.getThemeDecls('visited')
		
		this.declGroups.push({
			state: 'visited',
			decls: [...themeDecls]
		})

		return utils.css.newRule(this.generateSelectorList(':visited'), [
			...themeDecls
		])
	}

	get hover () {
		let { utils } = this.chassis
		let themeDecls = this.getThemeDecls('hover')
		
		this.declGroups.push({
			state: 'hover',
			decls: [...themeDecls]
		})

		return utils.css.newRule(this.generateSelectorList(':hover'), [
			...themeDecls
		])
	}

	get active () {
		let { utils } = this.chassis
		let themeDecls = this.getThemeDecls('active')
		
		this.declGroups.push({
			state: 'active',
			decls: [...themeDecls]
		})

		return utils.css.newRule(this.generateSelectorList(':active'), [
			...themeDecls
		])
	}

	get disabled () {
		let { utils } = this.chassis
		let themeDecls = this.getThemeDecls('disabled')
		
		this.declGroups.push({
			state: 'disabled',
			decls: [...themeDecls]
		})

		return utils.css.newRule(`${this.generateSelectorList('[disabled]')}, ${this.generateSelectorList('.disabled')}`, [
			utils.css.newDeclObj('cursor', 'default'),
			utils.css.newDeclObj('pointer-events', 'none'),
			...themeDecls
		])
	}

	get focus () {
		let { utils } = this.chassis
		let themeDecls = this.getThemeDecls('focus')
		
		this.declGroups.push({
			state: 'focus',
			decls: [...themeDecls]
		})

		return utils.css.newRule(this.generateSelectorList(':focus'), [
			...themeDecls
		])
	}
}

module.exports = ChassisLinkComponent
