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
				return styles
			}

			return output.append(styles)
		}, components[0])
	}
}

module.exports = DetailerMixins
