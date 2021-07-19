import React from 'react';

const SearchBar = ({ onSubmit, onChange, value, className, ...props }) => {
  return (
    <div className={className}>
      <form onSubmit={onSubmit}>
        <div className='input-group mb-3'>
          <input
            value={value}
            onChange={onChange}
            type='text'
            className='form-control'
            placeholder='Search a product by its name'
            aria-label='Product search'
            aria-describedby='basic-addon2'
          />
          <div className='input-group-append'>
            <button className='btn btn-outline-primary' type='submit'>
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
