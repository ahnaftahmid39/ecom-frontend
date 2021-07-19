import Layout from '../Layout';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getCartItems,
  updateCartItem,
  deleteCartItem,
  getAndValidateCoupon,
  updateCartDiscount,
} from '../../api/apiOrder';
import { userInfo } from '../../utils/auth';
import CartItem from './CartItem';
import { showError } from '../../utils/messages';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponInfo, setCouponInfo] = useState({});
  const [error, setError] = useState('');

  const loadCartItems = () => {
    getCartItems(userInfo().token)
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => {
        const msg = err.response?.data.message || 'Something went wrong';
        setError(msg);
        setTimeout(() => {
          setError('');
        }, 2000);
      });
  };

  const updateCartItems = (cartItem) => {
    updateCartItem(userInfo().token, cartItem)
      .then((res) => {
        console.log(res.data);
        loadCartItems();
      })
      .catch((err) => {
        const msg = err.response?.data.message || 'Something went wrong';
        setError(msg);
        setTimeout(() => {
          setError('');
        }, 2000);
      });
  };

  const removeCartItem = (cartItem) => () => {
    if (!window.confirm('Delete Item?')) return;
    deleteCartItem(userInfo().token, cartItem)
      .then((res) => {
        loadCartItems();
      })
      .catch((err) => {
        const msg = err.response?.data.message || 'Something went wrong';
        setError(msg);
        setTimeout(() => {
          setError('');
        }, 2000);
      });
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const getTotalPrice = () => {
    let totalPrice = 0;
    let multiplier = 1;
    if (couponInfo.discount) {
      multiplier = 1 - couponInfo.discount / 100;
    }
    for (const item of cartItems) {
      totalPrice += item.count * item.price;
    }
    return totalPrice * multiplier;
  };

  const increaseItem = (item) => () => {
    if (item.count === 5) return;
    const cartItem = {
      ...item,
      count: item.count + 1,
    };
    updateCartItems(cartItem);
  };

  const decreaseItem = (item) => () => {
    if (item.count === 1) return;
    const cartItem = {
      ...item,
      count: item.count - 1,
    };
    updateCartItems(cartItem);
  };

  const checkCoupon = (e) => {
    e.preventDefault();
    getAndValidateCoupon(userInfo().token, couponCode)
      .then((res) => {
        if (res.data) {
          setCouponInfo(res.data);
          updateCartDiscount(userInfo().token, res.data.discount).catch(
            (err) => {
              const error =
                err.response?.data.message || 'something went wrong';
              setError(error);
              setTimeout(() => {
                setError('');
              }, 2000);
            }
          );
        }
      })
      .catch((err) => {
        const error = err.response?.data.message || 'something went wrong';
        setError(error);
        setTimeout(() => {
          setError('');
        }, 2000);
      });
  };

  return (
    <Layout
      title='Your Cart'
      description='Hurry up! Place your order!'
      className='container'
    >
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <a href='#'>Order</a>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Cart
          </li>
        </ol>
      </nav>
      <div className='container my-5'>
        {showError(error, error)}
        <table className='table table-hover'>
          <thead>
            <tr>
              <th scope='col' width='15%'>
                #
              </th>
              <th scope='col'>Image</th>
              <th scope='col'>Product Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col' align='right'>
                Price
              </th>
              <th scope='col'>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartItems &&
              cartItems.map((item, i) => (
                <CartItem
                  key={item._id}
                  item={item}
                  serial={i + 1}
                  increaseItem={increaseItem(item)}
                  decreaseItem={decreaseItem(item)}
                  removeItem={removeCartItem(item)}
                  multiplier={
                    couponInfo.discount ? 1 - couponInfo.discount / 100 : 1
                  }
                />
              ))}
            <tr>
              <th scope='row' />
              <td colSpan={2}>Total</td>
              <td align='right' colSpan={2}>
                ৳ {getTotalPrice()}
              </td>
              <td />
            </tr>
            <tr>
              <th scope='row'></th>
              <td colSpan={2}>Use coupon</td>
              <td colSpan={2}>
                <form onSubmit={checkCoupon}>
                  <input
                    className='mx-4'
                    placeholder='Write your coupon'
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                    }}
                  />
                  <button type='submit' className='btn btn-primary'>
                    Check Coupon
                  </button>
                </form>
              </td>
            </tr>
            {Object.keys(couponInfo).length > 0 && (
              <tr className='p-2'>
                <th scope='row'></th>
                <td colSpan={2}>Using coupon: {couponInfo.name}</td>
                <td colSpan={2}>Discount: {couponInfo.discount}%</td>
              </tr>
            )}
            <tr>
              <th scope='row' />
              <td colSpan={4} className='text-right'>
                <Link to='/'>
                  <button className='btn btn-warning mr-4'>
                    Continue Shoping
                  </button>
                </Link>
                <Link to='/shipping' className='btn btn-success mr-4'>
                  Proceed To Checkout
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Cart;
