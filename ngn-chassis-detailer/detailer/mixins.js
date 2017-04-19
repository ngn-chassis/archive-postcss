const DetailerProject = require('./project')

class DetailerMixins {
	constructor (project) {
		this.project = project
	}

	extend (args, parent, nodes) {
		let { components, utils } = this.project

		let component
		let css = []
		let base = utils.newRule(parent.selector, [])

		parent.nodes.forEach(node => {
			if (node.type === 'decl') {
				base.nodes.push(node)
				return
			}

			if (node.type === 'atrule') {
				if (node.nodes) {
					component = components.get(args[0], node.nodes)
				} else {
					component = components.get(args[0])
				}
			}
		})

		return base
	}

	include (components) {
		return components.map(component => this.project.components.get(component))
	}
}

module.exports = DetailerMixins
