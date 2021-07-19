import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { Link } from 'react-router-dom';
import { showError, showSuccess, showLoading } from '../../utils/messages';
import { createProduct, getCategories } from '../../api/apiAdmin';
import { userInfo } from '../../utils/auth';

const CreateProduct = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    loading: false,
    error: false,
    success: false,
    disabled: false,
    formData: '',
  });

  const {
    name,
    description,
    price,
    categories = [],
    category,
    quantity,
    loading,
    error,
    success,
    formData,
    disabled,
  } = values;

  useEffect(async () => {
    try {
      const { data } = await getCategories();
      setValues({
        ...values,
        categories: data,
        formData: new FormData(),
      });
    } catch (err) {
      setValues({
        ...values,
        error: err.response.data || 'Something went wrong',
        formData: new FormData(),
      });
    }
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(e.target.name, value);
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({
      ...values,
      error: false,
      loading: true,
      success: false,
      disabled: true,
    });
    const user = userInfo();
    try {
      const res = await createProduct(user.token, formData);
      setValues({
        ...values,
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
        loading: false,
        error: false,
        success: true,
        disabled: false,
      });
      console.log(res);
    } catch (err) {
      setValues({
        ...values,
        loading: false,
        error: err.response.data.message || 'Something went wrong',
        disabled: false,
        success: false,
      });
    }
  };

  const productForm = () => (
    <form className='mb-3' onSubmit={handleSubmit}>
      <h4>Photo:</h4>
      <div className='form-group'>
        <label className='btn btn-secondary'>
          <input
            type='file'
            name='photo'
            onChange={handleChange}
            accept='image/*'
            required
          />
        </label>
      </div>
      <div className='form-group'>
        <label className='text-muted'>Name:</label>
        <input
          name='name'
          onChange={handleChange}
          type='text'
          className='form-control'
          value={name}
          required
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Description:</label>
        <textarea
          name='description'
          onChange={handleChange}
          className='form-control'
          value={description}
          required
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Price:</label>
        <input
          name='price'
          onChange={handleChange}
          className='form-control'
          type='number'
          value={price}
          required
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Quantity:</label>
        <input
          name='quantity'
          onChange={handleChange}
          className='form-control'
          type='number'
          value={quantity}
          required
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Category:</label>
        <select
          name='category'
          value={category}
          onChange={handleChange}
          className='form-control'
          required
        >
          <option value=''>----Select Category----</option>
          {categories?.length > 0 &&
            categories.map((val) => {
              return (
                <option value={val._id} key={val._id}>
                  {val.name}
                </option>
              );
            })}
        </select>
      </div>
      <button
        className='btn btn-outline-primary'
        type='submit'
        disabled={disabled}
      >
        Create Product
      </button>
    </form>
  );

  const goBack = () => (
    <div className='mt-5'>
      <Link to='/admin/dashboard' className='text-warning'>
        Go to Dashboard
      </Link>
    </div>
  );

  return (
    <Layout title='Add a new product'>
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showError(error, error)}
          {showLoading(loading)}
          {showSuccess(success, 'Product Added Successfully!')}
          {productForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
