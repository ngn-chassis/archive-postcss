const nesting = require('postcss-nesting')

class ChassisSpecSheet {
	constructor (chassis, spec) {
		this.chassis = chassis
		this.spec = spec
		this.states = []
		
		spec.walkComments((comment) => comment.remove())
		this.selectors = spec.nodes[0].selector.split(',')
	}
	
	get css () {
		// TODO handle states, resolve vars
	}
}

module.exports = ChassisSpecSheet
