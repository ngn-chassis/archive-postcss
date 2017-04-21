const TestComponent = require('./components/test')

class DetailerComponents {
	constructor (project) {
		this.project = project
	}

	get (component, parent, nodes) {
		let config = {
			states: {}
		}

		if (parent) {
			config.selector = parent.selector
		}

		if (nodes) {
			nodes.forEach(rule => {
				config.states[rule.selector] = {}

				rule.nodes.forEach(node => {
					config.states[rule.selector][node.prop] = node.value
				})
			})
		}

		return new this[component](this.project, config).styles
	}

	// get button () {
	// 	return {
	// 		definition: {
	// 			selector: '.chassis .button'
	// 		},
	// 		template: '/stylesheets/ui-components/button.css'
	// 	}
	// }
	//
	// get form () {
	// 	return {
	// 		template: [
	// 			'/stylesheets/ui-components/form/reset.css',
	// 			'/stylesheets/ui-components/form/standalone-elements.css',
	// 			'/stylesheets/ui-components/form/layout.css'
	// 		]
	// 	}
	// }
	//
	// get icon () {
	// 	return {
	// 		definition: {},
	// 		template: '/stylesheets/ui-components/icon.css'
	// 	}
	// }
	//
	// get modal () {
	// 	return {
	// 		definition: {},
	// 		template: '/stylesheets/ui-components/modal.css'
	// 	}
	// }
	//
	// get overlay () {
	// 	return {
	// 		definition: {},
	// 		template: '/stylesheets/ui-components/overlay.css'
	// 	}
	// }
	//
	// get tag () {
	// 	return {
	// 		definition: {},
	// 		template: '/stylesheets/ui-components/tag.css'
	// 	}
	// }
	//
	// get table () {
	// 	return {
	// 		definition: {},
	// 		template: '/stylesheets/ui-components/table.css'
	// 	}
	// }

	get test () {
		return TestComponent
	}
}

module.exports = DetailerComponents
