const DetailerUtils = require('../utilities')
const DetailerConstants = require('../constants')
const DetailerAtRules = require('./at-rules')
const DetailerMixins = require('./mixins')

class DetailerProject extends NGN.EventEmitter {
	constructor () {
		super()

		this.mixins = new DetailerMixins(this)
		this.atRules = new DetailerAtRules(this)
	}

	get coreStyles () {
		let root = DetailerUtils.parseStylesheets(DetailerConstants.stylesheets)

		return root
	}
}

module.exports = DetailerProject
