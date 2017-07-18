const ChassisComponent = require('../../component')

class ChassisModalComponent extends ChassisComponent {
	constructor	(chassis, theme, selectors = ['chassis-modal'], states = {
		
	}, extensions = NGN.coalesce(chassis.extensions.modal, null), resetType = 'block') {
		super(chassis, 'modal', theme, selectors, states, extensions, resetType)
	}
}

module.exports = ChassisModalComponent
