import Component from 'ember-component'
import computed  from 'ember-computed'

import {
  htmlSafe
} from 'ember-string'

export default Component.extend({
  tagName: 'ember-snipee',

  attributeBindings: [ 'style' ],

  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,

  setRectangle(rect) {
    this.setProperties(rect)
  },

  style: computed('x1', 'y1', 'x2', 'y2', function() {
    let x1 = this.get('x1') | 0
    let y1 = this.get('y1') | 0
    let x2 = this.get('x2') | 0
    let y2 = this.get('y2') | 0

    return htmlSafe(
      `top:${x1}px;` +
      `left:${y1}px;` +
      `width:${x2 - x1}px;` +
      `height:${y2 - y1}px`
    )
  }),

  _snip: computed({
    set(key, snip) {
      snip.set('snipee', this)
    }
  })
})
