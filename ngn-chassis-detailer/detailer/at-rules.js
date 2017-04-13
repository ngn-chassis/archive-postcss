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
			case 'include':
				atRule.replaceWith(mixins.include(args))
				break

			case 'init':
        atRule.replaceWith(mixins.init())
        break

			default:
				console.error(`Detailer At-Rules: At-Rule ${mixin} not found`)
				atRule.remove()
		}
	}
}

module.exports = DetailerAtRules
