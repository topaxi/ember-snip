import computed from 'ember-computed'

const { floor, ceil, min, max } = Math

export default function computedSnapAxis(x2, offsetProperty, X) {
  let snapProperty = `snap${X}`
  let minX         = `min${X}`
  let maxX         = `max${X}`
  let dependentKeys = [
    'rectangle',
    offsetProperty,
    snapProperty,
    minX,
    maxX,
    '_restrictToOffset'
  ]

  return computed(...dependentKeys, function snapAxis(x1) {
    let rect    = this.get('rectangle')
    let snapTo  = max(this.get(snapProperty), 1)
    let offset  = this.get(offsetProperty)
    let roundFn = rect[x1] > rect[x2] ? ceil : floor
    let x       = roundTo(rect[x1] - offset, snapTo, roundFn) + offset

    if (this.get('_restrictToOffset')) {
      x = min(this.get(maxX), max(this.get(minX), x))
    }

    return x
  }).readOnly()
}

function roundTo(value, to, fn) {
  return fn(value / to) * to
}
