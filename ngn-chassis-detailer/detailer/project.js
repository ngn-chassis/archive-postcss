const DetailerAtRules = require('./at-rules')
const DetailerMixins = require('./mixins')
const DetailerComponents = require('./components')

class DetailerProject extends NGN.EventEmitter {
	constructor () {
		super()

		this.components = new DetailerComponents(this)
		this.mixins = new DetailerMixins(this)
		this.atRules = new DetailerAtRules(this)
	}
}

module.exports = DetailerProject
