const ChassisUtils = require('../utilities')

class ChassisPlugins {
	constructor (project, plugins) {
		this.project = project
		this.plugins = plugins ? plugins.map(plugin => plugin.init(plugin.name, plugin.basePath, project, ChassisUtils)) : []
	}

	get (pluginName) {
		return this.plugins.find(plugin => plugin.name === pluginName)
	}

	includes (pluginName) {
		return this.plugins.some(plugin => plugin.name === pluginName)
	}
}

module.exports = ChassisPlugins
