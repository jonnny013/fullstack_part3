import React from 'react'

const Notification = ({message, styling}) => {
    const style1 = {
        border: '2px solid green',
        backgroundColor: 'lightgray',
        color: 'green',
        fontSize: 20,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    const style2 = {
      border: "2px solid red",
      backgroundColor: "lightgray",
      color: "red",
      fontSize: 20,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    };

    const selection = styling === 'style1' ? style1 : style2
  return (
    <div style={selection} >{message}</div>
  )
}

export default Notification