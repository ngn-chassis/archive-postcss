require('ngn')
require('ngn-data')

const postcss = require('postcss')
const nesting = require('postcss-nesting')
const vars = require('postcss-advanced-variables')

const ChassisProject = require('./classes/project')
const ChassisUtils = require('./utilities')
const ChassisConstants = require('./constants')

class ChassisPostCss {
  constructor (config) {
    this.config = NGN.coalesce(config, {})
    this.plugins = null

    if (this.config.hasOwnProperty('plugins')) {
      this.plugins = config.plugins
    }

    this.project = new ChassisProject(this.plugins)
  }

  /**
   * @method _loadConfig
   * Load user configuration
   * @private
   */
  _loadConfig () {
    if (this.config.plugins) {
      delete this.config.plugins
    }

    if (!this.config.hasOwnProperty('viewportWidthRanges')) {
      this.config.viewportWidthRanges = ChassisConstants.defaultViewportWidthRanges
    }

    this.project.settings.load(this.config)
    this._validateSettings()
  }

  _process () {
    let { atRules, plugins } = this.project;
    
    return (root, result) => {
      let output = this._unnest(root)
      
      if (plugins.includes('Detailer')) {
        let Detailer = plugins.get('Detailer')
        
        output.walkAtRules('detailer', (atRule) => {
          Detailer.atRules.process(atRule, output)
        })
        
        // Run again to process any at-rules inside components
        // TODO: Possibly move this processing to component.js to avoid the
        // extra tree traversal
        output.walkAtRules('detailer', (atRule) => {
          Detailer.atRules.process(atRule, output)
        })
      }

      output.walkAtRules('chassis', (atRule) => {
        atRules.process(atRule, output)
      })

      // TODO: Process Variables

      // TODO: Process inline functions

      result.root = this._unnest(output)
    }
  }

  _unnest (root) {
    return postcss.parse(nesting.process(root))
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
    return this._process()
  }
}

module.exports = ChassisPostCss
