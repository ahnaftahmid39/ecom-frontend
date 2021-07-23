import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './home/Home';
import Login from './user/Login';
import Register from './user/Register';
import Dashboard from './user/Dashboard';
import PrivateRoute from './protectedRoutes/PrivateRoute';
import AdminDashBoard from './admin/AdminDashboard';
import AdminRoute from './protectedRoutes/AdminRoute';
import CreateCategory from './admin/CreateCategory';
import CreateProduct from './admin/CreateProduct';
import ProductDetails from './home/ProductsDetails';
import Cart from './order/Cart';
import ShipingAddress from './order/ShippingAddress';
import Checkout from './order/Checkout';
import Payment from './order/Payment';
import CreateCoupon from './admin/CreateCoupon';
import SocialLogin from './user/SocialLogin';

const Main = () => {
  return (
    <div>
      <Switch>
        <Route path='/home' exact component={Home} />
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route path='/loginsocial' exact component={SocialLogin} />
        <Route path='/product/:id' exact component={ProductDetails} />
        <PrivateRoute path='/user/dashboard' exact>
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path='/payment' exact>
          <Payment />
        </PrivateRoute>
        <PrivateRoute path='/cart'>
          <Cart />
        </PrivateRoute>
        <PrivateRoute path='/shipping'>
          <ShipingAddress />
        </PrivateRoute>
        <PrivateRoute path='/checkout'>
          <Checkout />
        </PrivateRoute>
        <AdminRoute path='/admin/dashboard'>
          <AdminDashBoard />
        </AdminRoute>
        <AdminRoute path='/admin/create/category'>
          <CreateCategory />
        </AdminRoute>
        <AdminRoute path='/admin/create/product'>
          <CreateProduct />
        </AdminRoute>
        <AdminRoute path='/admin/create/coupon'>
          <CreateCoupon />
        </AdminRoute>
        <Redirect to='/home' />
      </Switch>
    </div>
  );
};

export default Main;
