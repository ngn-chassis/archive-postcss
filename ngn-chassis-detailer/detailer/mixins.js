const DetailerProject = require('./project')

class DetailerMixins {
	constructor (project) {
		this.project = project
	}

	extend (componentName, parent, nodes) {
		nodes = nodes.length ? nodes : []
		return this.project.components.extend(componentName, parent, nodes)
	}

	include (components) {
		return components.reduce((output, component, index) => {
			let styles = this.project.components.get(component)

			if (index === 0) {
				output = styles
			} else {
				output.append(styles)
			}

			return output
		}, components[0])
	}
}

module.exports = DetailerMixins
