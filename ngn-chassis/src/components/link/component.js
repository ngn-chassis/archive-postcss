const ChassisComponent = require('../../component')

class ChassisLinkComponent extends ChassisComponent {
	constructor	(chassis, customSpec) {
		super(chassis, customSpec)
		
		this.name = 'link'
		this.selectors = ['a']
		this.resetType = 'inline'
	}
}

module.exports = ChassisLinkComponent
