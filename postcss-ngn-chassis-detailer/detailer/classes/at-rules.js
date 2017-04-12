const DetailerMixins = require('./mixins')

class DetailerAtRules {
	constructor (project) {
		this.project = project
	}

	process (atRule, root) {
		let params = atRule.params.split(' ')
		let mixin = params[0]
		let args = params.length > 1 ? params.slice(1) : null
		let nodes = NGN.coalesce(atRule.nodes, [])

		let { mixins } = this.project
		let css

		switch (mixin) {
			case 'init':
        atRule.replaceWith(mixins.init(args))
        break

			default:
				console.error(`Detailer At-Rules: At-Rule ${mixin} not found`)
				atRule.remove()
		}
	}
}

module.exports = DetailerAtRules
