import Layout from '../Layout';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getCartItems,
  updateCartItem,
  deleteCartItem,
} from '../../api/apiOrder';
import { userInfo } from '../../utils/auth';
import CartItem from './CartItem';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const loadCartItems = () => {
    getCartItems(userInfo().token)
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data.message);
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
        console.log(msg);
      });
  };

  const removeCartItem = (cartItem) => () => {
    if (!window.confirm('Delete Item?')) return;
    deleteCartItem(userInfo().token, cartItem)
      .then((res) => {
        loadCartItems();
      })
      .catch((err) => {
        const msg = err.response.data.message || 'Something went wrong';
        console.log(msg);
      });
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const getTotalPrice = () => {
    let totalPrice = 0;
    for (const item of cartItems) {
      totalPrice += item.count * item.price;
    }
    return totalPrice;
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
              <th scop='col'>Remove</th>
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
                />
              ))}
            <tr>
              <th scope='row' />
              <td colSpan={2}>Total</td>
              <td align='right'>৳ {getTotalPrice()}</td>
              <td />
            </tr>
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
