export default function ElementDimensions(props) {
  this.top          = props.top          | 0
  this.left         = props.left         | 0
  this.width        = props.width        | 0
  this.height       = props.height       | 0
  this.scrollTop    = props.scrollTop    | 0
  this.scrollLeft   = props.scrollLeft   | 0
  this.scrollWidth  = props.scrollWidth  | 0
  this.scrollHeight = props.scrollHeight | 0

  //Object.freeze(this)
}

if (Symbol.toStringTag) {
  ElementDimensions.prototype[Symbol.toStringTag] = 'ElementDimensions'
}
