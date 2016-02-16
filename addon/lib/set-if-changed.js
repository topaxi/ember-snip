import get from 'ember-metal/get'
import set from 'ember-metal/set'

export default function setIfChanged(obj, prop, value) {
  if (get(obj, prop) !== value) {
    set(obj, prop, value)
  }

  return value
}
