const ChassisConstants = require('../constants')

module.exports = new NGN.DATA.Model({
  fields: {
    gutter: {
      type: String,
      default: '6.18vw',
      pattern: /^(auto|0)$|^[0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc|vw|vh|rem)$/gi
    },
    minWidth: {
      type: Number,
      default: ChassisConstants.defaultMinWidth,
      min: 0
    },
    maxWidth: {
      type: Number,
      default: ChassisConstants.defaultMaxWidth,
      min: 0
    }
  }
})
