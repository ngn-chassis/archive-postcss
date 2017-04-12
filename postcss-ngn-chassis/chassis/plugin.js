require('ngn')
require('ngn-data')

const ChassisProject = require('./classes/project')
const ChassisUtils = require('./utilities')
const ChassisConstants = require('./constants')

class ChassisPlugin {
  constructor (config) {
    this.config = NGN.coalesce(config, {})
    this.project = new ChassisProject()
  }

  /**
   * @method _loadConfig
   * Load user configuration
   * @private
   */
  _loadConfig () {
    if (!this.config.hasOwnProperty('viewportWidthRanges')) {
      this.config.viewportWidthRanges = ChassisConstants.defaultViewportWidthRanges
    }

    this.project.settings.load(this.config)
    this._validateSettings()
  }

  /**
   * @method _validateSettings
   * Validate project settings configuration
   * @private
   */
  _validateSettings () {
    if (!this.project.settings.valid) {
      console.error('[ERROR] Chassis Configuration: Invalid fields:')
      console.error(this.project.settings.invalidDataAttributes.join(', '))
    }
  }

  /**
   * @method init
   * Initialize ChassisPostCss plugin and process at-rules
   */
  init () {
    this._loadConfig()

    return (root, result) => {
      root.walkAtRules('chassis', (atRule) => {
        this.project.atRules.process(atRule, root)
      })
    }
  }
}

module.exports = ChassisPlugin
