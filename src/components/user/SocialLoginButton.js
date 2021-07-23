import axios from 'axios';
import React from 'react';
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from 'react-social-login-buttons';

const SocialLoginButton = (props) => {
  const backend = 'https://guarded-lake-12126.herokuapp.com';
  return (
    <div className={props.className}>
      <GoogleLoginButton
        onClick={() => {
          try {
            window.open(`${backend}/auth/google`, '_self');
          } catch (error) {
            console.log(error.message);
          }
        }}
      />
      <FacebookLoginButton
        onClick={() => {
          axios
            .get(`${backend}/auth/facebook`)
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err.response?.data || err.message);
            });
        }}
      />
    </div>
  );
};

export default SocialLoginButton;
