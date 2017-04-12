const DetailerProject = require('./project')

class DetailerMixins {
	constructor (project) {
		this.project = project
	}

	init (args) {
		// console.log('args: ', args)
		return this.project.coreStyles
	}
}

module.exports = DetailerMixins
