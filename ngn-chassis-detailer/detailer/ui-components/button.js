const DetailerComponent = require('../component')

class DetailerButtonComponent extends DetailerComponent {
	constructor (config) {
		config = NGN.coalesce(config, {})

		super(config)
	}
}
