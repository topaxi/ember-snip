import Component from 'ember-component'
import computed  from 'ember-computed'
import layout    from '../templates/components/ember-snip'

import computedInt       from '../lib/computed-int'
import ElementDimensions from '../lib/element-dimensions'

import Point, {
  ZERO_POINT
} from '../lib/point'

import Rectangle, {
  ZERO_RECTANGLE
} from '../lib/rectangle'

import {
  on,
  off,
  preventDefault
} from '../lib/events'

const { document } = window
const LEFT_MOUSE   = 1
const { abs, min } = Math

const EmberSnip = Component.extend({
  layout,

  tagName: 'ember-snip',
  snipee:  'ember-snipee',

  disabled: false,
  cancel:   null,
  distance: computedInt(),

  cancelOffset: true,
  offsetTop:    computedInt(),
  offsetLeft:   computedInt(),
  offsetRight:  computedInt(),
  offsetBottom: computedInt(),

  _moved:        false,
  _dimensions:   null,
  _startPoint:   null,
  _currentPoint: null,
  _lastPoint:    null,
  _rectangle:    null,

  init() {
    this._super(...arguments)

    this._startPoint   = ZERO_POINT
    this._currentPoint = ZERO_POINT
    this._lastPoint    = ZERO_POINT
    this._rectangle    = ZERO_RECTANGLE

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
    if (this.get('disabled') || this._isCancelled(e)) {
      return
    }

    let point = this._eventToPoint(this._eventDataForPoint(e))

    this._updateElementDimensions()

    if (this._clickedScrollbar(point) || this._clickedOffset(point)) {
      return
    }

    e.preventDefault()

    this._setStartPoint(point)
    this._setCurrentPoint(point)
    this._setLastPoint(point)

    this._toggleMoveListeners(true)

    this.sendAction('on-start', e)
  },

  'on-end'(e, self) {
    self.hideSnipee()
  },

  end(e) {
    this._moved = false
    this._toggleMoveListeners(false)
    this.sendAction('on-end', e, {
      hideSnipee: () => this.hideSnipee()
    })
  },

  move(e) {
    let point = this._eventToPoint(this._eventDataForPoint(e))

    if (!this._moved && this._notMovedBeyondDistance(point)) {
      return
    }

    this._moved = true
    this._setLastPoint(this._currentPoint)
    this._setCurrentPoint(point)

    let rect = this._createRectangle(
      this.get('_dimensions'),
      this._startPoint,
      this._currentPoint
    )

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

  hideSnipee() {
    this._updateSnipee(ZERO_RECTANGLE)
  },

  _eventDataForPoint(e) {
    if (e.changedTouches) {
      return e.changedTouches[0]
    }

    return e
  },

  _eventToPoint(e) {
    return new Point(e.pageX, e.pageY)
  },

  _clickedOffset(point) {
    if (!this.get('cancelOffset')) {
      return false
    }

    let dimensions = this.get('_dimensions')

    let left = point.x - dimensions.left
    let top  = point.y - dimensions.top

    return left < this.get('offsetLeft') ||
           top  < this.get('offsetTop')  ||
           left > dimensions.width  - this.get('offsetRight') ||
           top  > dimensions.height - this.get('offsetBottom')
  },

  _clickedScrollbar(point) {
    let dimensions = this.get('_dimensions')
    return point.x > dimensions.left + dimensions.width ||
           point.y > dimensions.top  + dimensions.height
  },

  _updateElementDimensions() {
    let $el = this.$()

    let { top, left, height, width } = this.element.getBoundingClientRect()
    let {
      scrollTop,
      scrollLeft,
      scrollWidth,
      scrollHeight
    } = this.element

    top  += ($el.outerHeight(false) - height) / 2
    left += ($el.outerWidth(false)  - width)  / 2

    this.set('_dimensions', new ElementDimensions({
      top,
      left,
      width,
      height,
      scrollTop,
      scrollLeft,
      scrollWidth,
      scrollHeight
    }))
  },

  _notMovedBeyondDistance(point) {
    if (!this.distance) {
      return false
    }

    return abs(this._startPoint.x - point.x) < this.distance &&
           abs(this._startPoint.y - point.y) < this.distance
  },

  _setCurrentPoint(point) {
    this._setPoint('_currentPoint', point)
  },

  _setStartPoint(point) {
    this._setPoint('_startPoint', point)
  },

  _setLastPoint(point) {
    this._setPoint('_lastPoint', point)
  },

  _setPoint(prop, point) {
    this[prop] = point
  },

  _isCancelled(e) {
    return this.get('cancel') && e.target.matches(this.get('cancel'))
  },

  _createRectangle(dimensions, p1, p2) {
    let x1 = min(p1.x, p2.x) -
      dimensions.left +
      dimensions.scrollLeft

    let y1 = min(p1.y, p2.y) -
      dimensions.top +
      dimensions.scrollTop

    let x2 = x1 + abs(p1.x - p2.x)
    let y2 = y1 + abs(p1.y - p2.y)

    return new Rectangle(x1, y1, x2, y2)
  },

  _updateSnipee(rect) {
    this.set('_rectangle', rect)
  }
})

export default EmberSnip
