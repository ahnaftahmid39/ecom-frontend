import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { authenticate, userInfo } from '../../utils/auth';

const SocialLogin = (props) => {
  useEffect(() => {
    const { search } = props.history.location;
    const { token } = queryString.parse(search);
    if (token)
      authenticate(token, () => {
        props.history.replace(`${userInfo().role}/dashboard`);
      });
  });

  return (
    <div
      style={{ height: '100vh' }}
      className='d-flex align-items-center justify-content-center'
    >
      <h4>Social login sucess! Redirecting to dashboard...</h4>
    </div>
  );
};

export default SocialLogin;
