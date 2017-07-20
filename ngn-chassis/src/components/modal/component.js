const ChassisComponent = require('../../component')

class ChassisModalComponent extends ChassisComponent {
	constructor	(chassis, customSpec) {
		super(chassis, 'modal', customSpec)
		
		this.selectors = ['chassis-modal']
		this.resetType = 'block'
	}
}

module.exports = ChassisModalComponent
