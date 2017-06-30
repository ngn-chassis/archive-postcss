const ChassisComponent = require('../component')

class ChassisLinkComponent extends ChassisComponent {
	constructor	(chassis, cfg) {
		super(chassis)

		this.chassis = chassis
		this.cfg = cfg || null

		this.states = [
			'default',
			'visited',
			'hover',
			'active',
			'disabled',
			'focus'
		]
	}

	get css () {
		let { settings, utils } = this.chassis
		let { rules } = this

		settings.componentResetSelectors.push('a')

		return utils.css.newRoot(rules)
	}

	get default () {
		let { utils } = this.chassis

		return utils.css.newRule('a:not(.button)', [
			...this.getThemeDecls('a')
		])
	}

	get visited () {
		let { utils } = this.chassis

		return utils.css.newRule('a:visited:not(.button)', [
			...this.getThemeDecls('a.visited')
		])
	}

	get hover () {
		let { utils } = this.chassis

		return utils.css.newRule('a:hover:not(.button)', [
			...this.getThemeDecls('a.hover')
		])
	}

	get active () {
		let { utils } = this.chassis

		return utils.css.newRule('a:active:not(.button)', [
			...this.getThemeDecls('a.active')
		])
	}

	get disabled () {
		let { utils } = this.chassis

		return utils.css.newRule('a[disabled]:not(.button), a.disabled:not(.button)', [
			utils.css.newDeclObj('cursor', 'default'),
			utils.css.newDeclObj('pointer-events', 'none'),
			...this.getThemeDecls('a.disabled')
		])
	}

	get focus () {
		let { utils } = this.chassis

		return utils.css.newRule('a:focus:not(.button)', [
			...this.getThemeDecls('a.focus')
		])
	}
}

module.exports = ChassisLinkComponent
