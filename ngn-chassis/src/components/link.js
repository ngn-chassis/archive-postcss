class ChassisLinkComponent {
	constructor	(chassis, cfg) {
		this.chassis = chassis
		this.cfg = cfg || null
		
		this.theme = chassis.settings.theme.links
		
		this.states = [
			{
				types: ['pseudoclass'],
				name: 'visited'
			},
			{
				types: ['pseudoclass'],
				name: 'hover'
			},
			{
				types: ['pseudoclass'],
				name: 'active'
			},
			{
				types: ['class', 'attribute'],
				name: 'disabled'
			},
			{
				types: ['pseudoclass'],
				name: 'focus'
			}
		]
	}
	
	
	
	get css () {
		let { css } = this.chassis.utils
		
		let root = css.newRoot([
			this.default
		])
		
		
		
		return root
	}
	
	get default () {
		let { utils } = this.chassis
		
		console.log(this.theme.fields);
		
		return utils.css.newRule(
			'.chassis a',
			this.theme.datafields.map((field) => {
				if (this.theme[field]) {
					return utils.css.newDeclObj(field, this.theme[field])
				}
			}).filter((entry) => entry !== undefined)
		)
	}
	
	get hover () {
		
	}
}

module.exports = ChassisLinkComponent
