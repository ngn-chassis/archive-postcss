const postcss = require('postcss')
const ChassisPostCss = require('./chassis/plugin.js')

module.exports = postcss.plugin('postcss-ngn-chassis', (config) => {
  return new ChassisPostCss(config).init()
})
