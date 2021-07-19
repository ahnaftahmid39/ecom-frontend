import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated, userInfo } from '../utils/auth';

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return {
      color: '#ff9900',
    };
  } else {
    return {
      color: 'gray',
    };
  }
};

const Menu = ({ history }) => {
  return (
    <nav className='navbar navbar-dark bg-dark'>
      <ul className='nav nav-tabs'>
        <li className='nav-item'>
          <Link
            className='nav-link'
            to='/home'
            style={isActive(history, '/home')}
          >
            Home
          </Link>
        </li>
        {!isAuthenticated() && (
          <>
            <li className='nav-item'>
              <Link
                className='nav-link'
                to='/login'
                style={isActive(history, '/login')}
              >
                Login
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className='nav-link'
                to='/register'
                style={isActive(history, '/register')}
              >
                Register
              </Link>
            </li>
          </>
        )}
        {isAuthenticated() && (
          <>
            <li className='nav-item'>
              <Link
                className='nav-link'
                style={isActive(history, `/${userInfo().role}/dashboard`)}
                to={`/${userInfo().role}/dashboard`}
              >
                Dashboard
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className='nav-link'
                style={isActive(history, `/cart`)}
                to={`/cart`}
              >
                Cart
              </Link>
            </li>
            <li className='nav-item'>
              <span
                className='nav-link'
                style={{ cursor: 'pointer', color: 'gray' }}
                onClick={() => {
                  signout(() => {
                    history.push('/login');
                  });
                }}
              >
                Logout
              </span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default withRouter(Menu);
