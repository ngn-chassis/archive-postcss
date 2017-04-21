const DetailerComponent = require('../component')

class TestComponent extends DetailerComponent {
	constructor (project, config) {
		super(project, config)

		this.selector = '.test'

		this.properties = {
			selector: this.selector,
			states: {
				default: {
					background: 'red'
				},
				hover: {
					background: 'blue'
				}
			}
		}
	}

	get styles () {
		return this.generateStyles(this.properties)
	}
}

module.exports = TestComponent
