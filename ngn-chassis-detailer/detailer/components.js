const TestComponent = require('./components/test')
const ButtonComponent = require('./components/button')

class DetailerComponents {
	constructor (project) {
		this.project = project
	}
	
	/**
	 * @method get
	 * get an AST of UI component styles
	 * @param  {string} @required component
	 * Semantic name of UI component
	 * @param  {Rule} parent
	 * Parent rule to which to add extended styles
	 * @param  {array} nodes
	 * array of custom states used to configure extended component
	 * @return {AST} component styles
	 */
	get (component, parent, nodes) {
		return new this[component](this.project, parent, nodes).styles
	}

	get button () {
		return ButtonComponent
	}
	
	get test () {
		return TestComponent
	}

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
}

module.exports = DetailerComponents
