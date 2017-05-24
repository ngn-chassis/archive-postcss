class ChassisMixins {
	constructor (chassis) {
		this.chassis = chassis
		
		this.mapping = {
			'constrain-width': this.constrainWidth
		}
	}
	
	get (mixin, data) {
		return this.mapping[mixin](data)
	}
	
	constrainWidth (data) {
		console.log(data);
		return ''
	}
	
	process (mixin, args, nodes, line) {
		console.log(mixin, args, nodes, line);
		
		// if (this.mapping.hasOwnProperty(this.name)) {
		// 	rule.replaceWith(this.mapping[this.name]())
		// 	return
		// }
		//
		// console.error(`Chassis stylesheet ${this.line}: Mixin "${this.mixin} not found."`)
	}
}

module.exports = ChassisMixins
