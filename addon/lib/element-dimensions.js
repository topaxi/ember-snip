export default function ElementDimensions(props) {
  this.top = +props.top
  this.left = +props.left
  this.width = +props.width
  this.height = +props.height
  this.scrollTop = +props.scrollTop
  this.scrollLeft = +props.scrollLeft
  this.scrollWidth = +props.scrollWidth
  this.scrollHeight = +props.scrollHeight

  //Object.freeze(this)
}

if (Symbol.toStringTag) {
  ElementDimensions.prototype[Symbol.toStringTag] = 'ElementDimensions'
}
