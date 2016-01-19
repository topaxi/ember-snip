import Component from 'ember-component'
import layout    from '../templates/components/ember-snip'

const { document }    = window
const LEFT_MOUSE      = 1
const preventDefault  = e => e.preventDefault()
const on              = (el, type, fun) => el.addEventListener(type, fun, false)
const off             = (el, type, fun) => el.removeEventListener(type, fun)
const { abs, min }    = Math
const EMPTY_RECTANGLE = new Rectangle(0, 0, 0, 0)

const EmberSnip = Component.extend({
  layout,

  tagName: 'ember-snip',

  cancel: null,
  _distance: 0,

  snipee: 'ember-snipee',

  _moved: false,
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

    this.move = this.move.bind(this)
    this.end  = this.end.bind(this)
  },

  _toggleMoveListeners(enable) {
    let fn = enable ? on : off

    fn(document, 'mouseup',    this.end)
    fn(document, 'touchend',   this.end)
    fn(document, 'mousemove',  this.move)
    fn(document, 'touchmove',  this.move)
    fn(document, 'mousewheel', preventDefault)
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
    this._setStartPosition(this._eventToPosition(e))
    this._setCurrentPosition(this._startPosition)
    this._setLastPosition({ pageX: 0, pageY: 0 })

    this._toggleMoveListeners(true)

    this.sendAction('on-start', e)
  },

  'on-end'(e, self) {
    self._updateSnipee(EMPTY_RECTANGLE)
  },

  end(e) {
    this._moved = false
    this._toggleMoveListeners(false)
    this.sendAction('on-end', e, this)
  },

  move(e) {
    let pos = this._eventToPosition(e)

    if (!this._moved && this._notMovedBeyondDistance(pos)) {
      return
    }

    this._moved = true
    this._setLastPosition(this._currentPosition)
    this._setCurrentPosition(pos)

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

  _eventToPosition(e) {
    if (e.changedTouches) {
      return e.changedTouches[0]
    }

    return e
  },

  _clickedScrollbar(pos) {
    return pos.pageX > this._offset.left + this.element.clientWidth ||
           pos.pageY > this._offset.top  + this.element.clientHeight
  },

  _updateElementDimensions() {
    let $el  = this.$()
    let top  = this._offset.top  + ($el.outerHeight(false) - $el.innerHeight()) / 2
    let left = this._offset.left + ($el.outerWidth(false)  - $el.innerWidth())  / 2

    this._dimensions.top        = top  | 0
    this._dimensions.left       = left | 0
    this._dimensions.width      = this.element.clientWidth
    this._dimensions.height     = this.element.clientHeight
    this._dimensions.scrollTop  = this.element.scrollTop
    this._dimensions.scrollLeft = this.element.scrollLeft
  },

  _notMovedBeyondDistance(pos) {
    if (!this._distance) {
      return false
    }

    return abs(this._startPosition.pageX - pos.pageX) < this._distance &&
           abs(this._startPosition.pageY - pos.pageY) < this._distance
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
    let x1 = min(this._startPosition.pageY, this._currentPosition.pageY) -
      this._dimensions.top +
      this._dimensions.scrollTop

    let y1 = min(this._startPosition.pageX, this._currentPosition.pageX) -
      this._dimensions.left +
      this._dimensions.scrollLeft

    let x2 = x1 + abs(this._startPosition.pageX - this._currentPosition.pageX)
    let y2 = y1 + abs(this._startPosition.pageY - this._currentPosition.pageY)

    return new Rectangle(x1, y1, x2, y2)
  },

  _updateSnipee(rect) {
    this.get('snipee').setRectangle(rect)
  }
})

function Rectangle(x1, y1, x2, y2) {
  this.x1 = x1
  this.y1 = y1
  this.x2 = x2
  this.y2 = y2
}

export default EmberSnip
