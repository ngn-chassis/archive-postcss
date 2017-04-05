const postcss = require('postcss')
const ChassisPostCss = require('./chassis/classes/plugin.js')

module.exports = postcss.plugin('postcss-ngn-chassis', (config) => {
  return new ChassisPostCss(config).init()
})
