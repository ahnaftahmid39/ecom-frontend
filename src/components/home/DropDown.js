import React from 'react';

const DropDown = ({ options = [], value, handleChange, ...props }) => {
  return (
    <select onChange={handleChange} value={value}>
      {options.map((val, idx) => {
        return (
          <option key={idx} value={val}>
            {val}
          </option>
        );
      })}
    </select>
  );
};

export default DropDown;
