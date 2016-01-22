export default function Point(x, y) {
  this.x = x | 0
  this.y = y | 0

  //Object.freeze(this)
}

if (Symbol.toStringTag) {
  Point.prototype[Symbol.toStringTag] = 'Point'
}

export const ZERO_POINT = new Point(0, 0)
