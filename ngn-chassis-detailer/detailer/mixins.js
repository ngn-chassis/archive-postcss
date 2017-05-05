const DetailerProject = require('./project')

class DetailerMixins {
	constructor (project) {
		this.project = project
	}

	extend (componentName, parent, nodes) {
		nodes = nodes.length ? nodes : []
		return this.project.components.get(componentName, parent, nodes)
	}

	include (components) {
		return components.map(component => this.project.components.get(component))
	}
}

module.exports = DetailerMixins
