import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated, userInfo } from '../../utils/auth';

const AdminRoute = ({ children, ...rest }) => {
  const { role } = userInfo();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated() && role === 'admin' ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/home',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default AdminRoute;
