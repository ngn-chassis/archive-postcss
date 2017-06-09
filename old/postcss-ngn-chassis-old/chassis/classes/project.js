const ChassisCore = require('./core')

const ChassisUtils = require('../utilities')
const ChassisConstants = require('../constants')
const ChassisAtRules = require('./at-rules')
const ChassisViewport = require('./viewport')
const ChassisTypography = require('./typography')
const ChassisLayout = require('./layout')
const ChassisMixins = require('./mixins')
const ChassisPlugins = require('./plugins')

const SettingsModel = require('../models/project-settings')

class ChassisProject extends NGN.EventEmitter {
  constructor (plugins) {
    super()

    this.settings = new SettingsModel()

    this.settings.once('load', () => {
      this.settings.viewportWidthRanges.sort({lowerBound: 'asc'})

      this.viewport = new ChassisViewport(this.settings.data.viewportWidthRanges)
      this.typography = new ChassisTypography(this.viewport, this.settings.data.typography)
      this.layout = new ChassisLayout(this.viewport, this.typography, this.settings.data.layout)

      this.mixins = new ChassisMixins(this)
      this.atRules = new ChassisAtRules(this)
      this.plugins = new ChassisPlugins(this, plugins)
      this.core = new ChassisCore(this)
    })
  }

  /**
   * @property coreStyles
   * Generate core styles including default typography and layout configuration
   * @return {AST}
   */
  get coreStyles () {
    return this.core.generate()
  }
}

module.exports = ChassisProject
