import { useState } from 'react';
import Layout from '../Layout';
import { showError, showLoading } from '../../utils/messages';
import { login } from '../../api/apiAuth';
import { Redirect } from 'react-router-dom';
import { authenticate, isAuthenticated, userInfo } from '../../utils/auth';
import SocialLoginButton from './SocialLoginButton';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: false,
    loading: false,
    disabled: false,
    redirect: false,
  });
  const { email, password, loading, error, redirect, disabled } = values;

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: true, disabled: true });
    try {
      const res = await login({
        email: email,
        password: password,
      });
      console.log(res.data);
      if (res.statusText == 'OK') {
        authenticate(res.data.token, () => {
          setValues({
            ...values,
            email: '',
            password: '',
            redirect: true,
            loading: false,
            disabled: false,
          });
        });
      } else {
        throw Error();
      }
    } catch (err) {
      setValues({
        ...values,
        error:
          err.response?.data ||
          err.request ||
          err.message ||
          'Something went wrong',
        loading: false,
        disabled: false,
      });
    }
  };

  const signInForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label className='text-muted'>Email:</label>
        <input
          name='email'
          type='email'
          className='form-control'
          value={email}
          required
          onChange={handleChange}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password:</label>
        <input
          name='password'
          type='password'
          className='form-control'
          value={password}
          required
          onChange={handleChange}
        />
      </div>
      <button
        type='submit'
        className='btn btn-outline-primary'
        disabled={disabled}
      >
        Login
      </button>
    </form>
  );
  const redirectUser = () => {
    if (redirect) return <Redirect to={`${userInfo().role}/dashboard`} />;
    if (isAuthenticated()) return <Redirect to='/home' />;
  };
  return (
    <Layout title='Login' className='container col-md-8 offset-md-2'>
      {redirectUser()}
      {showError(error, error)}
      {showLoading(loading)}
      <h3>Login Here,</h3>
      <hr />
      <SocialLoginButton />
      {signInForm()}
      <hr />
    </Layout>
  );
};

export default Login;
