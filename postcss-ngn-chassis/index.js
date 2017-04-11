const postcss = require('postcss')
const ChassisPlugin = require('./chassis/plugin.js')

module.exports = postcss.plugin('postcss-ngn-chassis', (config) => {
  return new ChassisPlugin(config).init()
})
