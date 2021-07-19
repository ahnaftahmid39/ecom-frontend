import React, { useState } from 'react';
import Layout from '../Layout';
import { showError, showLoading, showSuccess } from '../../utils/messages';
import { Link } from 'react-router-dom';
import { createCategory } from '../../api/apiAdmin';
import { userInfo } from '../../utils/auth';
const CreateCategory = () => {
  const [values, setValues] = useState({
    name: '',
    error: false,
    loading: false,
    success: false,
  });

  const { name, error, loading, success } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({
      ...values,
      loading: true,
    });
    try {
      const res = await createCategory(userInfo().token, { name: name });
      if (res.statusText === 'Created') {
        setValues({
          ...values,
          name: '',
          error: false,
          loading: false,
          success: true,
        });
      } else {
        throw Error();
      }
    } catch (err) {
      setValues({
        ...values,
        error: err.response?.data || 'Something went wrong',
        loading: false,
        success: false,
      });
    }
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const categoryForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label className='text-muted'>Name</label>
          <input
            name='name'
            type='text'
            onChange={handleChange}
            value={name}
            autoFocus
            required
            className='form-control'
          />
        </div>
        <button type='submit' className='btn btn-outline-primary'>
          Create Category
        </button>
      </form>
    );
  };

  const goBack = () => (
    <div className='mt-5'>
      <Link to='/admin/dashboard' className='text-warning'>
        Go to Dashboard
      </Link>
    </div>
  );

  return (
    <Layout
      title='Add a new category'
      description='Ready to add a new category?'
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {/* {showLoading(loading)} */}
          {showError(error, error)}
          {showSuccess(success, 'Category Created!')}
          {categoryForm()}
          {goBack()}
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
