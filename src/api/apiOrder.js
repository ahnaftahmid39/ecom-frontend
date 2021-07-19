import axios from 'axios';
import { API } from '../utils/config';

export const addToCart = (token, cartItem) => {
  return axios.post(`${API}/cart`, cartItem, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCartItems = (token) => {
  return axios.get(`${API}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCartItem = (token, cartItem) => {
  return axios.put(`${API}/cart`, cartItem, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCartDiscount = (token, amount) => {
  return axios.post(
    `${API}/cart/discount`,
    { discount: amount },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteCartItem = (token, cartItem) => {
  return axios.delete(`${API}/cart/${cartItem._id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProfile = (token) => {
  return axios.get(`${API}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = (token, data) => {
  return axios.post(`${API}/profile`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const initPayment = (token) => {
  return axios.get(`${API}/payment`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPurchaseHistory = (token) => {
  return axios.get(`${API}/user/purchase-history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAndValidateCoupon = (token, code) => {
  return axios.post(
    `${API}/coupon/validate`,
    { code: code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
