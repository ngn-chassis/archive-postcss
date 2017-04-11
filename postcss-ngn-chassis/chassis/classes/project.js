const ChassisUtils = require('../utilities')
const ChassisConstants = require('../constants')

const ChassisAtRules = require('./at-rules')
const ChassisViewport = require('./viewport')
const ChassisTypography = require('./typography')
const ChassisLayout = require('./layout')

const SettingsModel = require('../models/project-settings')

class ChassisProject extends NGN.EventEmitter {
  constructor () {
    super()

    this.settings = new SettingsModel()

    this.settings.once('load', () => {
      this.settings.viewportWidthRanges.sort({
        lowerBound: 'asc'
      })

      this.stylesDirectory = this.settings.projectStylesDirectory
      this.viewport = new ChassisViewport(this.settings.data.viewportWidthRanges)
      this.typography = new ChassisTypography(this.viewport, this.settings.data.typography)
      this.layout = new ChassisLayout(this.viewport, this.typography, this.settings.data.layout)
      this.atRules = new ChassisAtRules(this)
    })
  }

  _getFontWeightClasses () {
    return Object.keys(this.typography.fontWeights).map(weight => {
      return ChassisUtils.newRule(`.${weight}-weight`, [
        ChassisUtils.newDeclObj(
          'font-weight',
          `${this.typography.fontWeights[weight]} !important`
        )
      ])
    })
  }

  /**
   * @getter coreStyles
   * Generate core styles including default typography and layout configuration
   * @return {PostCss AST}
   */
  get coreStyles () {
    let firstRange = this.viewport.widthRanges[0]
    let root
    let mediaQueries = this._buildMediaQueries()

    root = ChassisUtils.parseStylesheets(ChassisConstants.stylesheets)

    .append(this._getFontWeightClasses())

    .append(ChassisUtils.newRule('.width-constraint', this.atRules.mixins.constrainWidth()))

    .append(ChassisUtils.newAtRule({
      name: 'media',
      params: `screen and (max-width: ${this.layout.minWidth}px)`,
      nodes: [
        ChassisUtils.newRule('.width-constraint', [
          ChassisUtils.newDeclObj('padding-left', this.layout.getGutterLimit(this.layout.minWidth)),
          ChassisUtils.newDeclObj('padding-right', this.layout.getGutterLimit(this.layout.minWidth))
        ])
      ]
    }))

    .append(ChassisUtils.newAtRule({
      name: 'media',
      params: `screen and (min-width: ${this.layout.maxWidth}px)`,
      nodes: [
        ChassisUtils.newRule('.width-constraint', [
          ChassisUtils.newDeclObj('padding-left', this.layout.getGutterLimit(this.layout.maxWidth)),
          ChassisUtils.newDeclObj('padding-right', this.layout.getGutterLimit(this.layout.maxWidth))
        ])
      ]
    }))

    .append(ChassisUtils.newRule('.chassis', [
      ChassisUtils.newDeclObj('min-width', `${this.layout.minWidth}px`),
      ChassisUtils.newDeclObj('margin', '0'),
      ChassisUtils.newDeclObj('padding', '0'),
      ChassisUtils.newDeclObj('font-size', `${this.typography.getFontSize('root', firstRange.upperBound)}px`),
      ChassisUtils.newDeclObj('line-height', `${this.typography.getLineHeight('root', firstRange.upperBound)}px`)
    ]))

    root.append(this._getHeadingProperties(firstRange))
    .append(this.typography.getFormLegendProperties(firstRange))
    .append(this.layout.getDefaultContainerProperties(firstRange))
    .append(this.layout.getDefaultBlockProperties(firstRange))
    .append(this.typography.getParagraphStyles(firstRange))
    .append(mediaQueries)

    return root
  }

  /**
   * @method _buildMediaQueries
   * Create media queries for default typography settings
   * @private
   */
  _buildMediaQueries () {
    let { widthRanges } = this.viewport

    return widthRanges.map((range, index) => {
      let mediaQuery

      if ( index === widthRanges.length - 1 ) {
        mediaQuery = this.viewport.getMediaQuery('min', range.name)
      } else if ( index !== 0 ) {
        mediaQuery = this.viewport.getMediaQuery('at', range.name)
      } else {
        return
      }

      if (!mediaQuery) {
        return
      }

      let rule = ChassisUtils.newRule('.chassis', [
        ChassisUtils.newDeclObj('font-size', `${this.typography.getFontSize('root', range.upperBound)}px`),
        ChassisUtils.newDeclObj('line-height', `${this.typography.getLineHeight('root', range.upperBound)}px`)
      ])

      mediaQuery.nodes = [
        ...mediaQuery.nodes,
        rule,
        ...this._getHeadingProperties(range),
        this.typography.getFormLegendProperties(range),
        this.layout.getDefaultContainerProperties(range),
        this.layout.getDefaultBlockProperties(range),
        this.typography.getParagraphStyles(range)
      ]

      return mediaQuery

    }).filter(mediaQuery => mediaQuery !== undefined)
  }

  /**
   * @method _getHeadingProperties
   * Generate default styles for h1-h6
   * @private
   */
  _getHeadingProperties (range) {
    let headings = []

    for (let i = 1; i <= 6; i++) {
      headings.push(this.typography.getHeadingProperties(i.toString(), range))
    }

    return headings
  }
}

module.exports = ChassisProject
