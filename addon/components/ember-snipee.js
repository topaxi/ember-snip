import Component from 'ember-component'
import computed  from 'ember-computed'

import {
  htmlSafe
} from 'ember-string'

const { floor, ceil, max } = Math

export default Component.extend({
  tagName: 'ember-snipee',

  attributeBindings: [ 'style' ],

  rectangle: null,

  snapX: 1,
  snapY: 1,

  x1: computedSnapAxis('x1', 'x2', 'snapX'),
  y1: computedSnapAxis('y1', 'y2', 'snapY'),
  x2: computedSnapAxis('x2', 'x1', 'snapX'),
  y2: computedSnapAxis('y2', 'y1', 'snapY'),

  style: computed('x1', 'y1', 'x2', 'y2', function style() {
    let x1 = this.get('x1')
    let y1 = this.get('y1')
    let x2 = this.get('x2')
    let y2 = this.get('y2')

    return htmlSafe(
      `top:${y1}px;` +
      `left:${x1}px;` +
      `width:${x2 - x1}px;` +
      `height:${y2 - y1}px`
    )
  }).readOnly()
})

function roundTo(value, to, fn) {
  return fn(value / to) * to
}

function computedSnapAxis(x1, x2, snap) {
  return computed('rectangle', snap, function snapAxis() {
    let rect   = this.get('rectangle')
    let snapTo = max(this.get(snap), 1)

    return roundTo(rect[x1], snapTo, rect[x1] > rect[x2] ? ceil : floor)
  }).readOnly()
}
