import React from 'react';
import { API } from '../../utils/config';

const CartItem = ({
  item,
  serial,
  increaseItem,
  decreaseItem,
  removeItem,
  multiplier = 1,
}) => {
  return (
    <tr>
      <th scope='row'>{serial}</th>
      <th>
        <img
          src={`${API}/product/photo/${item.product._id}`}
          style={{ width: '50px', maxHeight: '50vh' }}
        />
      </th>
      <td>{item.product.name}</td>
      <td>
        <button
          className='btn btn-outline-primary btn-sm'
          onClick={decreaseItem}
        >
          -
        </button>
        &nbsp;&nbsp;{item.count}&nbsp;&nbsp;
        <button
          className='btn btn-outline-primary btn-sm'
          onClick={increaseItem}
        >
          +
        </button>
      </td>
      <td>৳ {item.price * item.count * multiplier}</td>
      <td>
        <button className='btn btn-danger btn-sm' onClick={removeItem}>
          Remove From Cart
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
