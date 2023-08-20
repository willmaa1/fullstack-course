const Notification = ({ msg, color = 'red' }) => {
  if (msg === null) {
    return null
  }

  const styling = {
    color: color,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 5,
    background: 'lightgrey'
  }

  return (
    <div style={styling}>
      {msg}
    </div>
  )
}

export default Notification