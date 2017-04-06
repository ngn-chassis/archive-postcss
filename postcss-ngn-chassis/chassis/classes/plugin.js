require('ngn')
require('ngn-data')
const ChassisProject = require('./project')

class ChassisPostCss {
  constructor (config) {
    this.config = config || {}
    this.project = new ChassisProject()
  }

  /**
   * @method _loadConfig
   * Load user configuration
   * @private
   */
  _loadConfig () {
    if (!this.config.hasOwnProperty('viewportWidthRanges')) {
      this.config.viewportWidthRanges = this.project.defaultViewportWidthRanges
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
      console.error('Chassis Configuration Error: Invalid fields')
      console.error(this.project.settings.invalidDataAttributes.join(', '))
    }
  }

  /**
   * @method init
   * Initialize ChassisPostCss plugin and process at-rules
   */
  init () {
    this._loadConfig()

    return (input, output) => {
      input.walkAtRules('chassis', (rule) => {
        this.project.atRules.process(rule, input)
      })
    }
  }
}

module.exports = ChassisPostCss
