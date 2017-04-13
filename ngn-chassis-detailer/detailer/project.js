const DetailerAtRules = require('./at-rules')
const DetailerMixins = require('./mixins')
const DetailerComponents = require('./components')

class DetailerProject extends NGN.EventEmitter {
	constructor (name, basePath, project, utils) {
		super()

		this.utils = utils
		this.name = name
		this.basePath = basePath

		this.chassis = project
		this.components = new DetailerComponents(this)
		this.mixins = new DetailerMixins(this)
		this.atRules = new DetailerAtRules(this)
	}
}

module.exports = DetailerProject
