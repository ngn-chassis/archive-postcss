const DetailerComponent = require('../component')

class ButtonComponent extends DetailerComponent {
	constructor (project, parent, nodes) {
		let spec = 'button'
		
		super(project, spec, parent, nodes)
	}
}

module.exports = ButtonComponent
