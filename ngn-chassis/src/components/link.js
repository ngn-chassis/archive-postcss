const ChassisComponent = require('../component')

class ChassisLinkComponent extends ChassisComponent {
	constructor	(chassis, cfg) {
		super(chassis)

		this.chassis = chassis
		this.cfg = cfg || null

		this.theme = chassis.settings.theme.links
	}

	get css () {
		let { settings, utils } = this.chassis

		let rules = [
			...this.default,
			...this.visited,
			...this.hover,
			...this.active,
			...this.disabled,
			...this.focus
		]

		settings.componentResetSelectors.push('a')

		return utils.css.newRoot(rules)
	}

	get default () {
		let { utils } = this.chassis

		return [
			utils.css.newRule('a:not(.button)', [
				...super._getThemeDecls('a')
			])
		]
	}

	get visited () {
		let { utils } = this.chassis

		return [
			utils.css.newRule('a:visited:not(.button)', [
				...super._getThemeDecls('a.visited')
			])
		]
	}

	get hover () {
		let { utils } = this.chassis

		return [
			utils.css.newRule('a:hover:not(.button)', [
				...super._getThemeDecls('a.hover')
			])
		]
	}

	get active () {
		let { utils } = this.chassis

		return [
			utils.css.newRule('a:active:not(.button)', [
				...super._getThemeDecls('a.active')
			])
		]
	}

	get disabled () {
		let { utils } = this.chassis

		return [
			utils.css.newRule('a[disabled]:not(.button), a.disabled:not(.button)', [
				utils.css.newDeclObj('cursor', 'default'),
				utils.css.newDeclObj('pointer-events', 'none'),
				...super._getThemeDecls('a.disabled')
			])
		]
	}

	get focus () {
		let { utils } = this.chassis

		return [
			utils.css.newRule('a:focus:not(.button)', [
				...super._getThemeDecls('a.focus')
			])
		]
	}
}

module.exports = ChassisLinkComponent
