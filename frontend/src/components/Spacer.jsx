import PropTypes from "prop-types"

Spacer.propTypes = {
  space: PropTypes.number.isRequired
}

function Spacer({space}) {
  return (
    <div style={{height: space + "px"}}>
    </div>
  )
}

export default Spacer
