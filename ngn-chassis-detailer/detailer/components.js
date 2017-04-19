class DetailerComponents {
	constructor (project) {
		this.project = project
	}

	get (component, customProperties) {
		let definition = this[component]
		let styles

		if (NGN.typeof(definition) === 'array') {
			styles = this.project.utils.parseStylesheets(definition.map((stylesheet) => {
				return `${this.project.basePath}${stylesheet}`
			}))

		} else {
			styles = this.project.utils.parseStylesheet(`${this.project.basePath}${this[component]}`)
		}

		styles.walkAtRules((atRule) => {
			if (atRule.name === 'chassis') {
				this.project.chassis.atRules.process(atRule, styles)
			}

			if (atRule.name === 'detailer') {
				this.project.atRules.process(atRule, styles)
			}
		})

		if (customProperties) {
			console.log(customProperties);
			styles.walkRules((rule) => {

			})
		}

		return styles
	}

	get button () {
		return '/stylesheets/ui-components/button.css'
	}

	get form () {
		return [
			'/stylesheets/ui-components/form/reset.css',
			'/stylesheets/ui-components/form/standalone-elements.css',
			'/stylesheets/ui-components/form/layout.css'
		]
	}

	get icon () {
		return '/stylesheets/ui-components/icon.css'
	}

	get modal () {
		return '/stylesheets/ui-components/modal.css'
	}

	get overlay () {
		return '/stylesheets/ui-components/overlay.css'
	}

	get tag () {
		return '/stylesheets/ui-components/tag.css'
	}

	get table () {
		return '/stylesheets/ui-components/table.css'
	}
}

module.exports = DetailerComponents
