import $         from 'jquery'
import Component from 'ember-component'
import layout    from '../templates/components/ember-snip'

const LEFT_MOUSE     = 1
const preventDefault = e => e.preventDefault()
const { abs, min }   = Math

const EmberSnip = Component.extend({
  layout,

  tagName: 'ember-snip',

  cancel: null,

  _offset: null,
  _dimensions: null,
  _startPosition: null,
  _currentPosition: null,
  _lastPosition: null,

  init() {
    this._super(...arguments)

    this._offset          = null
    this._dimensions      = {}
    this._startPosition   = {}
    this._currentPosition = {}
    this._lastPosition    = {}
    this._$document       = $(document)
  },

  start(e) {
    if (this._isCancelled(e)) {
      return
    }

    let $el = this.$()

    this._offset = $el.offset()

    if (this._clickedScrollbar(e)) {
      return
    }

    e.preventDefault()

    this._updateElementDimensions()
    this._setStartPosition(e)
    this._setCurrentPosition(e)
    this._setLastPosition({ pageX: 0, pageY: 0 })

    this._$document.on('mouseup.ember-snip touchend.ember-snip', e => this.end(e))
                   .on('mousemove.ember-snip touchmove.ember-snip', e => this.move(e))
                   .on('mousewheel.ember-snip', preventDefault)
    this.sendAction('on-start', e)
  },

  'on-end'(e, self) {
    self._updateSnipee({ top: 0, left: 0, width: 0, height: 0 })
  },

  end(e) {
    this._$document.off('.ember-snip')
    this.sendAction('on-end', e, this)
  },

  move(e) {
    this._setLastPosition(this._currentPosition)
    this._setCurrentPosition(e)

    let rect = this._calcRect()

    this._updateSnipee(rect)
    this.sendAction('on-move', rect)
  },

  mouseDown(e) {
    if (e.which === LEFT_MOUSE) {
      this.start(e)
    }
  },

  touchStart(e) {
    this.start(e)
  },

  _clickedScrollbar(pos) {
    return pos.pageX > this._offset.left + this.element.clientWidth ||
           pos.pageY > this._offset.top  + this.element.clientHeight
  },

  _updateElementDimensions() {
    let $el  = this.$()
    let top  = this._offset.top  + ($el.outerHeight(false) - $el.innerHeight()) / 2
    let left = this._offset.left + ($el.outerWidth(false)  - $el.innerWidth())  / 2

    this._dimensions.top        = top
    this._dimensions.left       = left
    this._dimensions.width      = this.element.clientWidth
    this._dimensions.height     = this.element.clientHeight
    this._dimensions.scrollTop  = this.element.scrollTop
    this._dimensions.scrollLeft = this.element.scrollLeft
  },

  _setCurrentPosition(pos) {
    this._setPosition('_currentPosition', pos)
  },

  _setStartPosition(pos) {
    this._setPosition('_startPosition', pos)
  },

  _setLastPosition(pos) {
    this._setPosition('_lastPosition', pos)
  },

  _setPosition(prop, pos) {
    this[prop].pageX = pos.pageX
    this[prop].pageY = pos.pageY
  },

  _isCancelled(e) {
    return this.get('cancel') && this.$(e.target).is(this.get('cancel'))
  },

  _calcRect() {
    let top = min(this._startPosition.pageY, this._currentPosition.pageY) -
      this._dimensions.top +
      this._dimensions.scrollTop

    let left = min(this._startPosition.pageX, this._currentPosition.pageX) -
      this._dimensions.left +
      this._dimensions.scrollLeft

    let width  = abs(this._startPosition.pageX - this._currentPosition.pageX)
    let height = abs(this._startPosition.pageY - this._currentPosition.pageY)

    return { top, left, width, height }
  },

  _updateSnipee(rect) {
    this.get('snipee').setProperties(rect)
  }
})

export default EmberSnip
