const ExtensibleComponent = require('./component')

class DetailerComponents {
	constructor (project) {
		this.project = project
		
		this.extensibleComponents = [
			'button',
			'overlay',
			'modal',
			'icon',
			'tag',
			'test'
		]
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
		if (this.extensibleComponents.includes(component)) {
			return new ExtensibleComponent(this.project, component, nodes).styles
		} else {
			return this.project.utils.parseStylesheet(`../../ngn-chassis-detailer/detailer/stylesheets/ui-components/${component}.css`)
		}
	}
}

module.exports = DetailerComponents
