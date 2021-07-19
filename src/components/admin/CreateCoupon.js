import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createCoupon } from '../../api/apiAdmin';
import { userInfo } from '../../utils/auth';
import { showError, showSuccess } from '../../utils/messages';
import Layout from '../Layout';

const CreateCoupon = (props) => {
  const [values, setValues] = useState({
    name: '',
    code: '',
    discount: 0,
    error: '',
    disabled: false,
    success: false,
  });

  const { name, code, discount, disabled, error, success } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      disabled: true,
    });
    createCoupon(userInfo().token, { name, code, discount })
      .then((res) => {
        if (res.data) {
          setValues({
            ...values,
            name: '',
            code: '',
            discount: 0,
            success: true,
          });
          setTimeout(() => {
            setValues({
              ...values,
              name: '',
              code: '',
              discount: 0,
              success: false,
              disabled: false,
            });
          }, 2000);
        }
      })
      .catch((err) => {
        const error =
          err.response?.data?.message || err.message || 'Something went wrong';
        setValues({
          ...values,
          error: error,
          disabled: false,
        });
        setTimeout(() => {
          setValues({
            ...values,
            error: '',
            disabled: false,
          });
        }, 2000);
      });
  };

  const goBack = () => (
    <div className='mt-5'>
      <Link to='/admin/dashboard' className='text-warning'>
        Go to Dashboard
      </Link>
    </div>
  );

  return (
    <Layout className='container' title='Add a new coupon'>
      {showError(error, error)}
      {showSuccess(success, 'Coupon Added Successfully!')}
      {goBack()}
      <form className='mb-3' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label className='text-muted'>Name:</label>
          <input
            type='text'
            name='name'
            className='form-control'
            value={name}
            onChange={(e) => {
              setValues({ ...values, name: e.target.value });
            }}
            required
          />
        </div>
        <div className='form-group'>
          <label className='text-muted'>Coupon Code:</label>
          <input
            type='text'
            name='code'
            className='form-control'
            value={code}
            onChange={(e) => {
              setValues({ ...values, code: e.target.value });
            }}
          />
        </div>
        <div class='form-group'>
          <label className='text-muted'>Discount Amount:</label>
          <input
            type='number'
            name='discount'
            className='form-control'
            value={discount}
            onChange={(e) => {
              setValues({ ...values, discount: e.target.value });
            }}
          />
        </div>
        <button
          className='btn btn-outline-primary'
          type='submit'
          disabled={disabled}
        >
          Create Coupon
        </button>
      </form>
    </Layout>
  );
};

export default CreateCoupon;
