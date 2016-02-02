import Component from 'ember-component'

import computed, {
  oneWay
} from 'ember-computed'

import Rectangle, {
  ZERO_RECTANGLE
} from '../lib/rectangle'

import computedNumber   from '../lib/computed-number'
import computedSnapAxis from '../lib/computed-snap-axis'

export default Component.extend({
  tagName: 'ember-snipee',

  attributeBindings: [ 'style' ],

  rectangle: ZERO_RECTANGLE,

  minX: oneWay('_offsetLeft'),
  minY: oneWay('_offsetTop'),
  maxX: computed('_offsetRight', '_dimensions', function maxX() {
    return this.get('_dimensions.scrollWidth') - this.get('_offsetRight')
  }),
  maxY: computed('_offsetBottom', '_dimensions', function maxY() {
    return this.get('_dimensions.scrollHeight') - this.get('_offsetBottom')
  }),

  snapX: computedNumber(),
  snapY: computedNumber(),

  _dimensions:       null,
  _restrictToOffset: null,
  _offsetTop:        computedNumber(),
  _offsetLeft:       computedNumber(),

  x1: computedSnapAxis('x2', '_offsetLeft', 'X'),
  y1: computedSnapAxis('y2', '_offsetTop',  'Y'),
  x2: computedSnapAxis('x1', '_offsetLeft', 'X'),
  y2: computedSnapAxis('y1', '_offsetTop',  'Y'),

  init(...args) {
    this._super(...args)
    this.set('snapX', 1)
    this.set('snapY', 1)
  },

  createRectangle(x1, y1, x2, y2) {
    return new Rectangle(x1, y1, x2, y2)
  },

  style: computed('x1', 'y1', 'x2', 'y2', function style() {
    let rectangle = this.createRectangle(
      this.get('x1'),
      this.get('y1'),
      this.get('x2'),
      this.get('y2')
    )

    this.sendAction('on-draw', rectangle)

    return rectangle.html
  }).readOnly()
})
