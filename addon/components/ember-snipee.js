import Component from '@ember/component'
import { observer } from '@ember/object'

import { once } from '@ember/runloop'

import { computed } from '@ember/object'
import { oneWay } from '@ember/object/computed'

import Rectangle, { ZERO_RECTANGLE } from '../lib/rectangle'

import setIfChanged from '../lib/set-if-changed'
import computedNumber from '../lib/computed-number'
import computedSnapAxis from '../lib/computed-snap-axis'

const noop = () => {}

export default Component.extend({
  tagName: 'ember-snipee',

  attributeBindings: ['style'],

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

  x1: computedNumber(),
  y1: computedNumber(),
  x2: computedNumber(),
  y2: computedNumber(),

  _dimensions: null,
  _restrictToOffset: null,
  _offsetTop: computedNumber(),
  _offsetLeft: computedNumber(),

  _x1: computedSnapAxis('x1', 'x2', '_offsetLeft', 'X'),
  _y1: computedSnapAxis('y1', 'y2', '_offsetTop', 'Y'),
  _x2: computedSnapAxis('x2', 'x1', '_offsetLeft', 'X'),
  _y2: computedSnapAxis('y2', 'y1', '_offsetTop', 'Y'),

  _observeRectangle: observer('rectangle', function() {
    once(this, this._processRectangle)
  }),

  _processRectangle() {
    setIfChanged(this, 'x1', this.get('_x1'))
    setIfChanged(this, 'y1', this.get('_y1'))
    setIfChanged(this, 'x2', this.get('_x2'))
    setIfChanged(this, 'y2', this.get('_y2'))
  },

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
      this.get('y2'),
    )
    ;(this['on-draw'] || noop)(rectangle)

    return rectangle.html
  }).readOnly(),
})
