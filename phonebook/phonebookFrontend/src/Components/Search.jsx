import React from 'react'

const Search = (props) => {
  return (
    <>
      <form>
        <div>
          Search: <input value={props.search} onChange={props.onChange} />
        </div>
      </form>
    </>
  );
}

export default Search