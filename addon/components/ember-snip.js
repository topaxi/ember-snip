import Component from 'ember-component'
import layout    from '../templates/components/ember-snip'

const { document }    = window
const LEFT_MOUSE      = 1
const preventDefault  = e => e.preventDefault()
const on              = (el, type, fun) => el.addEventListener(type, fun, false)
const off             = (el, type, fun) => el.removeEventListener(type, fun)
const { abs, min }    = Math
const EMPTY_RECTANGLE = new Rectangle(0, 0, 0, 0)
const ZERO_POINT      = new Point(0, 0)

const EmberSnip = Component.extend({
  layout,

  tagName: 'ember-snip',

  disabled: false,
  cancel: null,
  _distance: 0,

  snipee: 'ember-snipee',

  _moved: false,
  _offset: null,
  _dimensions: null,
  _startPoint: null,
  _currentPoint: null,
  _lastPoint: null,

  init() {
    this._super(...arguments)

    this._startPoint   = ZERO_POINT
    this._currentPoint = ZERO_POINT
    this._lastPoint    = ZERO_POINT

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

    let $el   = this.$()
    let point = this._eventToPoint(this._eventDataForPoint(e))

    this._offset = $el.offset()


    if (this._clickedScrollbar(point)) {
      return
    }

    e.preventDefault()

    this._updateElementDimensions()
    this._setStartPoint(point)
    this._setCurrentPoint(this._startPoint)
    this._setLastPoint(ZERO_POINT)

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
      this._dimensions,
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
    this._updateSnipee(EMPTY_RECTANGLE)
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

  _clickedScrollbar(point) {
    return point.x > this._offset.left + this.element.clientWidth ||
           point.y > this._offset.top  + this.element.clientHeight
  },

  _updateElementDimensions() {
    let $el  = this.$()
    let top  = this._offset.top  + ($el.outerHeight(false) - $el.innerHeight()) / 2
    let left = this._offset.left + ($el.outerWidth(false)  - $el.innerWidth())  / 2

    this._dimensions = new ElementDimension({
      top,
      left,
      width:      this.element.clientWidth,
      height:     this.element.clientHeight,
      scrollTop:  this.element.scrollTop,
      scrollLeft: this.element.scrollLeft
    })
  },

  _notMovedBeyondDistance(point) {
    if (!this._distance) {
      return false
    }

    return abs(this._startPoint.x - point.x) < this._distance &&
           abs(this._startPoint.y - point.y) < this._distance
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
    return this.get('cancel') && this.$(e.target).is(this.get('cancel'))
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
    let [ snipee ] = this.childViews

    if (snipee) {
      snipee.set('rectangle', rect)
    }
  }
})

function Point(x, y) {
  this.x = x | 0
  this.y = y | 0

  //Object.freeze(this)
}

function Rectangle(x1, y1, x2, y2) {
  this.x1 = x1 | 0
  this.y1 = y1 | 0
  this.x2 = x2 | 0
  this.y2 = y2 | 0

  //Object.freeze(this)
}

function ElementDimension(props) {
  this.top        = props.top        | 0
  this.left       = props.left       | 0
  this.width      = props.width      | 0
  this.height     = props.height     | 0
  this.scrollTop  = props.scrollTop  | 0
  this.scrollLeft = props.scrollLeft | 0

  //Object.freeze(this)
}

if (Symbol.toStringTag) {
  Point.prototype[Symbol.toStringTag] = 'Point'
  Rectangle.prototype[Symbol.toStringTag] = 'Rectangle'
  ElementDimension.prototype[Symbol.toStringTag] = 'ElementDimension'
}

export default EmberSnip
