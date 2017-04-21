const DetailerProject = require('./project')

class DetailerMixins {
	constructor (project) {
		this.project = project
	}

	extend (componentName, parent, nodes) {
		let { components, utils } = this.project

		if (!nodes.length) {
			return components.get(componentName, parent)
		}

		return components.get(componentName, parent, nodes)
	}

	include (components) {
		return components.map(component => this.project.components.get(component))
	}
}

module.exports = DetailerMixins
