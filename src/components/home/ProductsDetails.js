import { useEffect, useState } from 'react';
import Layout from '../Layout';
import { API } from '../../utils/config';
import { Link } from 'react-router-dom';
import {
  getProductDetails,
  getProductReviews,
  addReviewToProduct,
} from '../../api/apiProduct';
import { showSuccess, showError } from '../../utils/messages';
import { isAuthenticated, userInfo } from '../../utils/auth';
import { addToCart } from '../../api/apiOrder';

const ProductDetails = (props) => {
  const productId = props.match.params.id;
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const getDetails = () => {
    getProductDetails(productId)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((err) => setError('Failed to load products'));
  };

  const getReviews = () => {
    getProductReviews(productId)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => setError('Failded to load reviews!'));
  };

  useEffect(() => {
    getDetails();
    getReviews();
  }, []);

  const handleAddToCart = (product) => () => {
    if (isAuthenticated()) {
      setError(false);
      setSuccess(false);
      const user = userInfo();
      const cartItem = {
        user: user._id,
        product: product._id,
        price: product.price,
      };
      addToCart(user.token, cartItem)
        .then((res) => {
          console.log(res.data);
          setSuccess(true);
          setError(false);
        })
        .catch((err) => {
          const errorMsg = err.response.data.message || 'something went wrong';
          console.log(errorMsg);
          setError(errorMsg);
        });
    } else {
      setError('You need to be authenticated first');
    }
  };

  const handleRatingChange = (e) => {
    setNewReview({ ...newReview, rating: e.target.value });
  };
  const handleCommentChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value });
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    addReviewToProduct(productId, userInfo().token, newReview)
      .then((res) => {
        getReviews();
        setNewReview({ rating: 5, comment: '' });
      })
      .catch((err) => {
        const error =
          err.resonse?.data.message || err.resonse?.data || 'something failed';
        setError(error);
      });
  };

  return (
    <Layout title='Product Page'>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <Link to='/'>Home</Link>
          </li>
          <li className='breadcrumb-item'>
            <a href='#'>Product</a>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            {product.category ? product.category.name : ''}
          </li>
        </ol>
      </nav>
      <div>
        {showSuccess(success, 'Item Added to Cart!')}
        {showError(error, error)}
      </div>
      <div className='container row'>
        <div className='col-6'>
          {product?._id && (
            <img
              src={`${API}/product/photo/${product._id}`}
              alt={product.name}
              width='100%'
            />
          )}
        </div>
        <div className='col-6'>
          <h3>{product.name}</h3>
          <span style={{ fontSize: 20 }}>&#2547;</span>
          {product.price}
          <p>
            {product.quantity ? (
              <span className='badge badge-pill badge-primary'>In Stock</span>
            ) : (
              <span className='badge badge-pill badge-danger'>
                Out of Stock
              </span>
            )}
          </p>
          <p>{product.description}</p>
          {product.quantity ? (
            <>
              &nbsp;
              <button
                className='btn btn-outline-primary btn-md'
                onClick={handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
      {isAuthenticated() ? (
        <div className='m-3 p-4' style={{ border: '1px solid black' }}>
          <form onSubmit={handleAddReview}>
            <div className='p-3'>
              <h5>Add Review!</h5>
              <div>Rating:</div>
              <input
                type='number'
                value={newReview.rating}
                placeholder='Rating'
                onChange={handleRatingChange}
              />
              <div>Comment:</div>
              <textarea
                className='w-100'
                type='textarea'
                value={newReview.comment}
                placeholder='Rating'
                onChange={handleCommentChange}
              />
              <button type='submit' className='btn btn-primary'>
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className='mt-5 px-5'>
          <h5>
            You have to be authenticated and buyer of this product to add review
          </h5>
        </div>
      )}
      <div className='p-4'>
        {reviews.length > 0
          ? reviews
              .map((review, idx) => {
                return (
                  <div key={idx} className='p-3 my-2 card'>
                    <div className='card-body'>
                      <div className='card-title'>
                        <h5>{review.user.name}</h5>
                      </div>
                      <div className='card-text'>Rating: {review.rating}</div>
                      <div className='card-text'>{review.comment}</div>
                    </div>
                  </div>
                );
              })
              .reverse()
          : 'No Review Available'}
      </div>
    </Layout>
  );
};

export default ProductDetails;
