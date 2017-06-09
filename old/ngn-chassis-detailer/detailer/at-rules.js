const DetailerMixins = require('./mixins')

class DetailerAtRules {
	constructor (project) {
		this.project = project
	}

	process (atRule, root) {
		let { mixins } = this.project

		let params = atRule.params.split(' ')
		let mixin = params[0]
		let args = params.length > 1 ? params.slice(1) : null
		let nodes = NGN.coalesce(atRule.nodes, [])

		switch (mixin) {
			case 'extend':
				atRule.parent.replaceWith(mixins.extend(args[0], atRule.parent, nodes))
				break

			case 'include':
				atRule.replaceWith(mixins.include(args))
				break

			default:
				console.error(`Detailer At-Rules: At-Rule ${mixin} not found`)
				atRule.remove()
		}
	}
}

module.exports = DetailerAtRules
