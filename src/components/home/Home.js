import { useState, useEffect } from 'react';
import Layout from '../Layout';
import Card from './Card';
import { showError, showSuccess } from '../../utils/messages';
import {
  getCategories,
  getProducts,
  getProductDetails,
  getFilteredProducts,
} from '../../api/apiProduct';
import CheckBox from './CheckBox';
import RadioBox from './RadioBox';
import { prices } from '../../utils/prices';
import { isAuthenticated, userInfo } from '../../utils/auth';
import { addToCart } from '../../api/apiOrder';
import DropDown from './DropDown';
import { sortOptions, sortOrder } from '../../utils/sortOptions';
import SearchBar from './SearchBar';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(4);
  const [order, setOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('price');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState({
    category: [],
    price: [],
  });

  useEffect(() => {
    getProducts(sortBy, order, limit)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => setError('Failed to load products!'));
    getCategories()
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        setError(err.response?.data || 'Something went wrong with server');
      });
  }, []);

  const handleFilters = (myFilters, filterBy) => {
    const newFilters = { ...filters };
    if (filterBy == 'category') {
      newFilters[filterBy] = myFilters;
    }
    if (filterBy == 'price') {
      newFilters['price'] = prices[parseInt(myFilters)].arr;
    }
    const newSkip = 0;
    setSkip(newSkip);
    setFilters(newFilters);
    getFilteredProducts({
      skip: newSkip,
      limit,
      order,
      sortBy,
      filters: newFilters,
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        setError(err.response?.data.message || 'Something went wrong!');
      });
  };

  const handleLoadMore = () => {
    const newSkip = skip + limit;
    setSkip(newSkip);
    getFilteredProducts({
      skip: newSkip,
      limit,
      order,
      sortBy,
      filters: filters,
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        setError(err.response?.data.message || 'Something went wrong!');
      });
  };

  const handleFilterOptions = (e) => {
    const newSortBy = e.target.value;
    const newSkip = 0;
    setSkip(newSkip);
    setSortBy(newSortBy);

    getFilteredProducts({
      skip: newSkip,
      limit,
      order,
      sortBy: newSortBy,
      filters: filters,
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        setError(err.response?.data || 'Something went wrong!');
      });
  };

  const handleSortingOrder = (e) => {
    const newOrder = e.target.value;
    setOrder(newOrder);
    getFilteredProducts({
      skip,
      limit,
      order: newOrder,
      sortBy,
      filters: filters,
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        setError(err.response?.data || 'Something went wrong!');
      });
  };

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    getFilteredProducts({
      skip,
      limit,
      order,
      sortBy,
      filters,
      searchName: search,
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        setError(err.response?.data || 'Something went wrong!');
      });
  };

  const handleSearchOnChange = (e) => {
    setSearch(e.target.value);
  };

  const showFilters = () => {
    return (
      <div className='row'>
        <div className='col-sm-3'>
          <h5>{'Filter By Categories'}</h5>
          <ul>
            <CheckBox
              categories={categories}
              handleFilters={(myFilters) => {
                handleFilters(myFilters, 'category');
              }}
            />
          </ul>
        </div>

        <div className='col-sm-5'>
          <h5>Filter By Price:</h5>
          <div className='row'>
            <RadioBox
              prices={prices}
              handleFilters={(myfilters) => handleFilters(myfilters, 'price')}
            />
          </div>
        </div>

        <div className='col'>
          <h5>Sort by</h5>
          <DropDown
            handleChange={handleFilterOptions}
            options={sortOptions}
            value={sortBy}
          />
        </div>
        <div className='col'>
          <h5>Sorting order</h5>
          <DropDown
            options={sortOrder}
            handleChange={handleSortingOrder}
            value={order}
          />
        </div>
      </div>
    );
  };

  return (
    <Layout title='Home Page' className='container-fluid'>
      <div style={{ width: '100%' }}>
        <SearchBar
          className='my-2'
          value={search}
          onChange={handleSearchOnChange}
          onSubmit={handleSearchSubmit}
        />
        {showFilters()}
        {showError(error, error)}
        {showSuccess(success, 'Added to cart successfully!')}
      </div>
      <div className='row'>
        {products &&
          products.map((product) => (
            <Card
              product={product}
              key={product._id}
              handleAddToCart={handleAddToCart}
            />
          ))}
      </div>
      <center className='mb-5'>
        <button
          className='btn btn-primary'
          disabled={products?.length < limit}
          onClick={handleLoadMore}
        >
          Load More
        </button>
      </center>
    </Layout>
  );
};

export default Home;
