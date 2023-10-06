import React from 'react'

const AddNumber = (props) => {
  return (
    <>
      <h2>Add number</h2>
      <form onSubmit={props.addPerson}>
        <div>
          Name: <input value={props.newName} onChange={props.handleNewPerson} />
        </div>
        <div>
          Number:{" "}
          <input value={props.newNumber} onChange={props.handleNewNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
}

export default AddNumber