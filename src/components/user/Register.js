import { useState } from 'react';
import Layout from '../Layout';
import { Link, Redirect } from 'react-router-dom';
import { showError, showLoading } from '../../utils/messages';
import { register } from '../../api/apiAuth';
import { isAuthenticated } from '../../utils/auth';

const Register = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: false,
    loading: false,
    disabled: false,
    success: false,
  });

  const { name, email, password, success, error, loading, disabled } = values;

  const handleChange = (e) => {
    setValues({
      ...values,
      error: false,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: true, disabled: true });
    try {
      const { data } = await register({
        name: name,
        email: email,
        password: password,
      });
      setValues({
        ...values,
        name: '',
        email: '',
        password: '',
        success: true,
        loading: false,
        disabled: false,
      });
    } catch (err) {
      setValues({
        ...values,
        error: err.response.data || 'Something went wrong',
        loading: false,
        disabled: false,
        success: false,
      });
    }
  };

  const signUpForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label className='text-muted'>Name:</label>
        <input
          type='text'
          name='name'
          className='form-control'
          value={name}
          required
          onChange={handleChange}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Email:</label>
        <input
          type='email'
          name='email'
          className='form-control'
          value={email}
          required
          onChange={handleChange}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password:</label>
        <input
          type='password'
          name='password'
          className='form-control'
          value={password}
          required
          onChange={handleChange}
        />
      </div>
      <button type='submit' className='btn btn-primary' disabled={disabled}>
        Create Account
      </button>
    </form>
  );

  const showSuccess = () => {
    if (success) {
      return (
        <div className='alert alert-primary'>
          Sign up complete! go to <Link to='/login'>Login</Link> page now!
        </div>
      );
    }
  };

  return (
    <Layout title='Register' className='container col-md-8 offset-md-2'>
      {isAuthenticated() && <Redirect to='/home'/>}
      {showLoading(values.loading)}
      {showError(error, error)}
      {showSuccess()}
      <h3>Register Here,</h3>
      <hr />
      {signUpForm()}
      <hr />
    </Layout>
  );
};

export default Register;
