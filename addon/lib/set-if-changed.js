import { get } from '@ember/object'
import { set } from '@ember/object'

export default function setIfChanged(obj, prop, value) {
  if (get(obj, prop) !== value) {
    set(obj, prop, value)
  }

  return value
}
