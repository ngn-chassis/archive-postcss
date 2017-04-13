const DetailerUtils = require('../utilities')
const DetailerButtonComponent = require('./ui-components/button')

class DetailerComponents {
	constructor (project) {
		this.project = project
	}

	get (component) {
		return this[component]
	}

	get button () {
		return DetailerUtils.parseStylesheet('stylesheets/ui-components/button.css')
	}
}

module.exports = DetailerComponents
