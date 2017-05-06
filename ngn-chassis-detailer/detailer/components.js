const ExtensibleComponent = require('./component')

class DetailerComponents {
	constructor (project) {
		this.project = project
		this.basePath = '../../ngn-chassis-detailer/detailer/stylesheets/ui-components'
		this.extensibleComponentsPath = `${this.basePath}/extensible`
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
		let { utils } = this.project
		let path = `${this.extensibleComponentsPath}/${component}.spec.css`

		if (utils.fileExists(path)) {
			let spec = utils.parseStylesheet(path)
			return new ExtensibleComponent(this.project, spec, parent, nodes).styles
		}

		console.error(`Detailer Component "${component}" does not exist.`)
		return ''
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
			return utils.parseDirectory(path)
		}

		if (utils.fileExists(`${path}.css`)) {
			return utils.parseStylesheet(`${path}.css`)
		}

		return this.extend(component)
	}
}

module.exports = DetailerComponents
