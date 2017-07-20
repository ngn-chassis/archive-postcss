const ChassisComponent = require('../../component')

class ChassisLinkComponent extends ChassisComponent {
	constructor	(chassis, customSpec) {
		super(chassis, 'link', customSpec)
		
		this.selectors = ['a']
		this.resetType = 'inline'
	}
}

module.exports = ChassisLinkComponent
