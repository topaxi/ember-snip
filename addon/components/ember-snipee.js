import Component from 'ember-component'
import computed  from 'ember-computed'

import {
  htmlSafe
} from 'ember-string'

export default Component.extend({
  tagName: 'ember-snipee',

  attributeBindings: [ 'style' ],

  top: 0,
  left: 0,
  width: 0,
  height: 0,

  style: computed('top', 'left', 'width', 'height', function() {
    return htmlSafe(
      `top:${this.get('top')|0}px;` +
      `left:${this.get('left')|0}px;` +
      `width:${this.get('width')|0}px;` +
      `height:${this.get('height')|0}px`
    )
  }),

  snip: computed({
    set(key, snip) {
      snip.set('snipee', this)
    }
  })
})
