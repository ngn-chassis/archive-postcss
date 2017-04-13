const DetailerButtonComponent = require('./ui-components/button')

class DetailerComponents {
	constructor (project) {
		this.project = project
	}

	get (component) {
		return this[component]
	}

	get button () {
		let styles = this.project.utils.parseStylesheet(`${this.project.basePath}/stylesheets/ui-components/button.css`)

		styles.walkAtRules((atRule) => {
			if (atRule.name === 'chassis') {
				this.project.chassis.atRules.process(atRule, styles)
			}

			if (atRule.name === 'detailer') {
				this.project.atRules.process(atRule, styles)
			}
		})

		return styles
	}
}

module.exports = DetailerComponents
