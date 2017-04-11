const postcss = require('postcss')
const DetailerPlugin = require('./detailer/plugin.js')

module.exports = postcss.plugin('postcss-ngn-chassis-detailer', () => {
  return new DetailerPlugin().init()
})
