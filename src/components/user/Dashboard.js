import Layout from '../Layout';
import { Link } from 'react-router-dom';
import { userInfo } from '../../utils/auth';
import { useEffect, useState } from 'react';
import { getPurchaseHistory } from '../../api/apiOrder';

const Dashboard = () => {
  const { name, email, role, token } = userInfo();
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    getPurchaseHistory(token).then((res) => {
      if (res.data?.length > 0) {
        setPurchaseHistory(res.data);
      }
    });
  }, []);

  const UserLinks = () => {
    return (
      <div className='card'>
        <h4 className='card-header'>User Links</h4>
        <ul className='list-group'>
          <li className='list-group-item'>
            <Link className='nav-link' to='#'>
              My Cart
            </Link>
          </li>
          <li className='list-group-item'>
            <Link className='nav-link' to='#'>
              Update Profile
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const PurchaseHistory = () => (
    <div className='card mb-5'>
      <h3 className='card-header'>Purchase History</h3>
      <ol className='list-group p-3'>
        {purchaseHistory.length > 0
          ? purchaseHistory.map((his) => (
              <li
                className='list-item-group p-3 mb-3'
                style={{
                  border: '1px solid grey',
                  listStylePosition: 'inside',
                }}
                key={his._id}
              >
                <div>
                  <span>Purchase Date: </span>
                  <span>{new Date(his.updatedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <div>Product List</div>
                  <ul>
                    {his.cartItems.length > 0 &&
                      his.cartItems.map((cart) => {
                        return (
                          <li
                            style={{
                              listStyleType: 'square',
                              listStylePosition: 'outside',
                            }}
                            key={cart._id}
                          >
                            <div>{cart.product.name}</div>
                            <div>Total count: {cart.count}</div>
                            <div>Price: {cart.price}</div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                <div>
                  <div>Transaction Id:</div>
                  <div>{his.transaction_id}</div>
                </div>
              </li>
            ))
          : 'No history found'}
      </ol>
    </div>
  );

  const UserInfo = () => (
    <div className='card mb-5'>
      <h3 className='card-header'>User Information</h3>
      <ul className='list-group'>
        <li className='list-group-item'>{name}</li>
        <li className='list-group-item'>{email}</li>
        <li className='list-group-item'>{role}</li>
      </ul>
    </div>
  );

  return (
    <Layout title='Dashboard' className='container-fluid'>
      <div className='row'>
        <div className='col-sm-3'>
          <UserLinks />
        </div>
        <div className='col-sm-9'>
          <UserInfo />
          <PurchaseHistory />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
