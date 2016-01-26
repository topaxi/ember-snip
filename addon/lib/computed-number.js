import computed from 'ember-computed'

export default function computedNumber() {
  return computed({
    set: toNumber,
    get: toNumber
  })
}

function toNumber(key, value = 0) {
  return Number(value)
}
