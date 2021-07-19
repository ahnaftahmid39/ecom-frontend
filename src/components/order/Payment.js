import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initPayment } from '../../api/apiOrder';
import { userInfo } from '../../utils/auth';

const Payment = () => {
  const [sessionSuccess, setSessionSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const [redirectURL, setRedirectURL] = useState('');

  useEffect(() => {
    initPayment(userInfo().token)
      .then((res) => {
        if (res.data.status === 'SUCCESS') {
          setSessionSuccess(true);
          setRedirectURL(res.data.GatewayPageURL);
          setFailed(false);
        }
      })
      .catch((err) => {
        setFailed(true);
        setSessionSuccess(false);
      });
  }, []);

  return (
    <div>
      {sessionSuccess
        ? (window.location = redirectURL)
        : 'Payment is processing..'}
      {failed && (
        <>
          <p>Failed to start payment session</p>
          <Link to='/cart'>Go to cart</Link>
        </>
      )}
    </div>
  );
};

export default Payment;
