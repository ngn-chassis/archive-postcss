const ChassisProject = require('./project')
const util = require('../utilities')

class ChassisPostCss {
  constructor (config) {
    this.config = config || {}
    this.project = new ChassisProject()
  }

  loadConfig () {
    if (!this.config.hasOwnProperty('viewportWidthRanges')) {
      this.config.viewportWidthRanges = this.project.defaultViewportWidthRanges
    }

    this.project.settings.load(this.config)
    this.validateSettings()
  }

  validateSettings () {
    if (!this.project.settings.valid) {
      console.error('Chassis Configuration Error: Invalid fields')
      console.error(this.project.settings.invalidDataAttributes.join(', '))
    }
  }

  init () {
    this.loadConfig()

    return (input, output) => {
      input.walkAtRules('chassis', (rule) => {
        this.project.atRules.process(rule)
      })
    }
  }
}

module.exports = ChassisPostCss
