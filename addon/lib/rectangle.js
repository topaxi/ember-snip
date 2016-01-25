import {
  htmlSafe
} from 'ember-string'

export default class Rectangle {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1 | 0
    this.y1 = y1 | 0
    this.x2 = x2 | 0
    this.y2 = y2 | 0

    //Object.freeze(this)
  }

  get width() {
    return this.x2 - this.x1
  }

  get height() {
    return this.y2 - this.y1
  }

  get html() {
    return htmlSafe(
      `top:${this.y1}px;` +
      `left:${this.x1}px;` +
      `width:${this.width}px;` +
      `height:${this.height}px`
    )
  }
}

if (Symbol.toStringTag) {
  Rectangle.prototype[Symbol.toStringTag] = 'Rectangle'
}

export const ZERO_RECTANGLE = new Rectangle(0, 0, 0, 0)
