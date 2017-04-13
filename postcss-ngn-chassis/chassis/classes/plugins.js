const ChassisUtils = require('../utilities')

class ChassisPlugins {
	constructor (project, plugins) {
		this.project = project
		this.plugins = plugins
	}

	get (pluginName) {
		return this.plugins.find(plugin => plugin.name === pluginName)
	}

	includes (pluginName) {
		return this.plugins && this.plugins.some(plugin => plugin.name === pluginName)
	}
}

module.exports = ChassisPlugins
