import Component from 'ember-component'

import computed, {
  oneWay
} from 'ember-computed'

import {
  htmlSafe
} from 'ember-string'

import Rectangle, {
  ZERO_RECTANGLE
} from '../lib/rectangle'

import computedInt      from '../lib/computed-int'
import computedSnapAxis from '../lib/computed-snap-axis'

export default Component.extend({
  tagName: 'ember-snipee',

  attributeBindings: [ 'style' ],

  rectangle: null,

  minX: oneWay('_offsetLeft'),
  minY: oneWay('_offsetTop'),
  maxX: computed('_offsetRight', '_dimensions', function() {
    return this.get('_dimensions.scrollWidth') - this.get('_offsetRight')
  }),
  maxY: computed('_offsetBottom', '_dimensions', function() {
    return this.get('_dimensions.scrollHeight') - this.get('_offsetBottom')
  }),

  snapX: computedInt(),
  snapY: computedInt(),

  _dimensions:       null,
  _restrictToOffset: null,
  _offsetTop:        null,
  _offsetLeft:       null,

  x1: computedSnapAxis('x1', 'x2', '_offsetLeft', 'X'),
  y1: computedSnapAxis('y1', 'y2', '_offsetTop',  'Y'),
  x2: computedSnapAxis('x2', 'x1', '_offsetLeft', 'X'),
  y2: computedSnapAxis('y2', 'y1', '_offsetTop',  'Y'),

  init(...args) {
    this._super(...args)
    this.set('snapX', 1)
    this.set('snapY', 1)
  },

  style: computed('x1', 'y1', 'x2', 'y2', function style() {
    let x1 = this.get('x1')
    let y1 = this.get('y1')
    let x2 = this.get('x2')
    let y2 = this.get('y2')

    this.sendAction('on-draw', new Rectangle(x1, y1, x2, y2))

    return htmlSafe(
      `top:${y1}px;` +
      `left:${x1}px;` +
      `width:${x2 - x1}px;` +
      `height:${y2 - y1}px`
    )
  }).readOnly()
})
