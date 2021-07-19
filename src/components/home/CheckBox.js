import React, { useState } from 'react';

const CheckBox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = (id) => {
    return () => {
      const foundId = checked.indexOf(id);
      const checkedIds = [...checked];
      if (foundId === -1) {
        checkedIds.push(id);
      } else {
        checkedIds.splice(foundId, 1);
      }
      setChecked(checkedIds);
      handleFilters(checkedIds);
    };
  };

  return categories?.map((category) => (
    <li className='list-unstyled' key={category._id}>
      <input
        value={checked.indexOf(category._id) == -1}
        onChange={handleToggle(category._id)}
        type='checkbox'
        className='form-check-input'
      />
      <label className='form-check-label'>{category.name}</label>
    </li>
  ));
};

export default CheckBox;
