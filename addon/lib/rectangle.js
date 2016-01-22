export default function Rectangle(x1, y1, x2, y2) {
  this.x1 = x1 | 0
  this.y1 = y1 | 0
  this.x2 = x2 | 0
  this.y2 = y2 | 0

  //Object.freeze(this)
}

if (Symbol.toStringTag) {
  Rectangle.prototype[Symbol.toStringTag] = 'Rectangle'
}

export const ZERO_RECTANGLE = new Rectangle(0, 0, 0, 0)
