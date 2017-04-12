require('ngn')
require('ngn-data')

const DetailerProject = require('./classes/project')

class DetailerPlugin {
	constructor () {
		this.project = new DetailerProject()
	}

  /**
   * @method init
   * Initialize ChassisPostCss plugin and process at-rules
   */
  init () {
    return (root, result) => {
      root.walkAtRules('detailer', (atRule) => {
				this.project.atRules.process(atRule, root)
      })
    }
  }
}

module.exports = DetailerPlugin
