const ExtensibleComponent = require('./component')

class DetailerComponents {
	constructor (project) {
		this.project = project

		this.basePath = '../../ngn-chassis-detailer/detailer/stylesheets/ui-components'
	}

	/**
	 * @method extend
	 * get an AST of extended UI component styles
	 * @param  {string} @required component
	 * Semantic name of UI component
	 * @param  {Rule} parent
	 * Parent rule to which to add extended styles
	 * @param  {array} nodes
	 * array of custom states used to configure extended component
	 * @return {AST} component styles
	 */
	extend (component, parent = null, nodes = null) {
		console.log(`extending ${component} component`);
		let output = new ExtensibleComponent(this.project, this.basePath, component, parent, nodes)
		return output.isExtensible ? output.styles : ''
	}

	/**
	 * @method get
	 * get an AST of UI component styles
	 * @param  {string} @required component
	 * Semantic name of UI component
	 * @return {AST} component styles
	 */
	get (component) {
		let { utils } = this.project

		let path = `${this.basePath}/${component}`

		if (utils.isDirectory(path)) {
			let files = utils.getAllFilesInDirectory(path).map(file => `${path}/${file}`)
			return utils.parseStylesheets(files)
		}

		if (utils.fileExists(`${path}.css`)) {
			return utils.parseStylesheet(`${path}.css`)
		}

		return this.extend(component)
	}
}

module.exports = DetailerComponents
