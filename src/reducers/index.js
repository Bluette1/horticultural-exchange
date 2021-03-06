import { combineReducers } from 'redux';
import auth from './auth';
import message from './message';
import cart from './cart';
import category from './category';
import product from './product';
import filter from './filter';
import wishlist from './wishlist';

export default combineReducers({
  auth,
  message,
  cart,
  category,
  product,
  filter,
  wishlist,
});
