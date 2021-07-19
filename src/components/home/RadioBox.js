const RadioBox = ({ prices, handleFilters }) => {
  const handleChange = (e) => {
    handleFilters(e.target.value);
  };

  return prices.map((price) => {
    return (
      <div key={price.id} className='col-6'>
        <input
          value={price.id}
          name='price_filter'
          className='mr-2'
          type='radio'
          onChange={handleChange}
        />
        <label className='form-check-label mr-4'>{price.name}</label>
      </div>
    );
  });
};

export default RadioBox;
