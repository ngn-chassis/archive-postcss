const DetailerProject = require('./project')

class DetailerMixins {
	constructor (project) {
		this.project = project
	}

	include (components) {
		return components.map(component => this.project.components.get(component))
	}

	init () {
		return this.project.coreStyles
	}
}

module.exports = DetailerMixins
