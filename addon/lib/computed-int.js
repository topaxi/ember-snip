import computed from 'ember-computed'

export default function computedInt() {
  return computed({
    set: toInteger,
    get: toInteger
  })
}

function toInteger(key, value) {
  return value | 0
}
