const ChassisUtils = require('../utilities')
const ChassisConstants = require('../constants')
const ChassisAtRules = require('./at-rules')
const ChassisViewport = require('./viewport')
const ChassisTypography = require('./typography')
const ChassisLayout = require('./layout')
const ChassisMixins = require('./mixins')

const SettingsModel = require('../models/project-settings')

class ChassisProject extends NGN.EventEmitter {
  constructor () {
    super()

    this.settings = new SettingsModel()
    this.mixins = new ChassisMixins(this)
    this.atRules = new ChassisAtRules(this)

    this.settings.once('load', () => {
      this.settings.viewportWidthRanges.sort({
        lowerBound: 'asc'
      })

      this.viewport = new ChassisViewport(this.settings.data.viewportWidthRanges)
      this.typography = new ChassisTypography(this.viewport, this.settings.data.typography)
      this.layout = new ChassisLayout(this.viewport, this.typography, this.settings.data.layout)
    })
  }

  /**
   * @property coreStyles
   * Generate core styles including default typography and layout configuration
   * @return {AST}
   */
  get coreStyles () {
    let firstRange = this.viewport.widthRanges[0]
    let root = ChassisUtils.parseStylesheets(ChassisConstants.stylesheets)

    root.append(ChassisUtils.newRule(
      ':root',
      Object.keys(this.typography.fontWeights).map(weight => {
        return ChassisUtils.newDecl(`--${weight}`, this.typography.fontWeights[weight])
      })
    ))

    root.append(this._fontWeightClasses)

    root.append(ChassisUtils.newRule('.width-constraint', this.mixins.constrainWidth()))

    root.append(ChassisUtils.newAtRule({
      name: 'media',
      params: `screen and (max-width: ${this.layout.minWidth}px)`,
      nodes: [
        ChassisUtils.newRule('.width-constraint', [
          ChassisUtils.newDeclObj('padding-left', this.layout.getGutterLimit(this.layout.minWidth)),
          ChassisUtils.newDeclObj('padding-right', this.layout.getGutterLimit(this.layout.minWidth))
        ])
      ]
    }))

    root.append(ChassisUtils.newAtRule({
      name: 'media',
      params: `screen and (min-width: ${this.layout.maxWidth}px)`,
      nodes: [
        ChassisUtils.newRule('.width-constraint', [
          ChassisUtils.newDeclObj('padding-left', this.layout.getGutterLimit(this.layout.maxWidth)),
          ChassisUtils.newDeclObj('padding-right', this.layout.getGutterLimit(this.layout.maxWidth))
        ])
      ]
    }))

    root.append(ChassisUtils.newRule('.chassis', [
      ChassisUtils.newDeclObj('min-width', `${this.layout.minWidth}px`),
      ChassisUtils.newDeclObj('margin', '0'),
      ChassisUtils.newDeclObj('padding', '0'),
      ChassisUtils.newDeclObj('font-size', `${this.typography.getFontSize('root', firstRange.upperBound)}px`),
      ChassisUtils.newDeclObj('line-height', `${this.typography.getLineHeight('root', firstRange.upperBound)}em`)
    ]))

    root.append(this._getDefaultHeadingProperties(firstRange))
    root.append(this._getDefaultFormLegendProperties(firstRange))
    root.append(this._getDefaultContainerProperties(firstRange))
    root.append(this._getDefaultBlockProperties(firstRange))
    root.append(this._getDefaultParagraphStyles(firstRange))
    root.append(this._defaultMediaQueries)

    return root
  }

  /**
   * @property _fontWeightClasses
   * generate rules for font-weight classes
   * ie. .thin-weight, .bold-weight etc.
   * @private
   */
  get _fontWeightClasses () {
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
   * @property _defaultMediaQueries
   * Create media queries for default typography settings
   * @private
   */
  get _defaultMediaQueries () {
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
        ChassisUtils.newDeclObj('line-height', `${this.typography.getLineHeight('root', range.upperBound)}em`)
      ])

      mediaQuery.nodes = [
        ...mediaQuery.nodes,
        rule,
        ...this._getDefaultHeadingProperties(range),
        this._getDefaultFormLegendProperties(range),
        this._getDefaultContainerProperties(range),
        this._getDefaultBlockProperties(range),
        this._getDefaultParagraphStyles(range)
      ]

      return mediaQuery

    }).filter(mediaQuery => mediaQuery !== undefined)
  }

  /**
   * @method _getDefaultContainerProperties
   * Get default decls for Container elements
   * @param {string} range
   * Current viewport width range
   * @return {rule}
   * @private
   */
  _getDefaultContainerProperties (range) {
    return ChassisUtils.newRule('.chassis section, .chassis nav, .chassis form', [
      ChassisUtils.newDeclObj('margin-bottom', `${this.layout.getMargin('root', range.upperBound, 'container')}em`)
    ])
  }

  /**
   * @method _getDefaultBlockProperties
   * Get default decls for Block elements
   * @param {string} range
   * Current viewport width range
   * @return {rule}
   * @private
   */
  _getDefaultBlockProperties (range) {
    return ChassisUtils.newRule('.chassis nav section, .chassis section nav, .chassis nav nav, .chassis article, .chassis fieldset, .chassis figure, .chassis pre, .chassis blockquote, .chassis table, .chassis canvas, .chassis embed', [
      ChassisUtils.newDeclObj('margin-bottom', `${this.layout.getMargin('root', range.upperBound, 'block')}em`)
    ])
  }

  /**
   * @method _getDefaultFormLegendProperties
   * Get GR-Typography default settings for legend tags
   * @param {object} range
   * Viewport Width Range
   * @return {rule}
   * @private
   */
  _getDefaultFormLegendProperties (range) {
    let alias = this.typography.fontSizes.formLegend

    let fontSize = `${this.typography.getFontSize(alias, range.upperBound, true)}em`
    let lineHeight = `${this.typography.getLineHeight(alias, range.upperBound)}em`
    let marginBottom = `${this.typography.getMargin(alias, range.upperBound)}em`

    return ChassisUtils.newRule('.chassis legend', [
      ChassisUtils.newDeclObj('font-size', fontSize),
      ChassisUtils.newDeclObj('line-height', lineHeight),
      ChassisUtils.newDeclObj('margin-bottom', marginBottom)
    ])
  }

  /**
   * @method _getDefaultHeadingProperties
   * Generate default styles for h1-h6
   * @private
   */
  _getDefaultHeadingProperties (range) {
    let headings = []

    for (let i = 1; i <= 6; i++) {
      let alias = this.typography.fontSizes.headings[i]

      let fontSize = `${this.typography.getFontSize(alias, range.upperBound, true)}em`
      let lineHeight = `${this.typography.getLineHeight(alias, range.upperBound)}em`
      let marginBottom = `${this.typography.getMargin(alias, range.upperBound)}em`

      headings.push(ChassisUtils.newRule(`.chassis h${i}`, [
        ChassisUtils.newDeclObj('font-size', fontSize),
        ChassisUtils.newDeclObj('line-height', lineHeight),
        ChassisUtils.newDeclObj('margin-bottom', marginBottom)
      ]))
    }

    return headings
  }

  /**
   * @method _getDefaultParagraphStyles
   * Get default styles for p tags
   * @private
   */
  _getDefaultParagraphStyles (range) {
    return ChassisUtils.newRule('.chassis p', [
      ChassisUtils.newDeclObj('margin-bottom', `${this.typography.getMargin('root', range.upperBound)}em`)
    ])
  }
}

module.exports = ChassisProject
