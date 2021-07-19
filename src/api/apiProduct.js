import { API } from '../utils/config';
import axios from 'axios';

export const getProductDetails = (id) => {
  return axios.get(`${API}/product/${id}`);
};

export const getCategories = () => {
  return axios.get(`${API}/category`);
};

export const getProducts = (sortBy, order, limit) => {
  return axios.get(
    `${API}/product?sortBy=${sortBy}&order=${order}&limit=${limit}`
  );
};

export const getFilteredProducts = ({
  skip,
  limit,
  order,
  sortBy,
  filters = {},
  searchName,
}) => {
  const data = {
    skip,
    limit,
    order,
    sortBy,
    filters,
    searchName,
  };
  console.log(data);
  return axios.post(`${API}/product/filter`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getProductReviews = (id) => {
  return axios.get(`${API}/product/reviews/${id}`);
};

export const addReviewToProduct = (id, token, review) => {
  return axios.post(`${API}/product/reviews/${id}`, review, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};
