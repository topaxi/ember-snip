export const on  = (el, type, fun) => el.addEventListener(type, fun, false)
export const off = (el, type, fun) => el.removeEventListener(type, fun)
export const preventDefault = e => e.preventDefault()
