const ChassisComponent = require('../../component')

class ChassisModalComponent extends ChassisComponent {
	constructor	(chassis, customSpec) {
		super(chassis, customSpec)
		
		this.name = 'modal'
		this.selectors = ['chassis-modal']
		this.resetType = 'block'
	}
}

module.exports = ChassisModalComponent
