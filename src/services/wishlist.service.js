import axios from "axios";
import authHeader from "./auth-header";
import { httpProtocol, host, port } from '../env.variables';

const API_URL = `${httpProtocol}://${host}:${port}/wishes`;
const headers = authHeader();

const addToWishlist = (user, product) => {
  const payload = {
    wish: {
      user_id: user.id,
      plant_id: product.id
    }
  };
  return axios.post(API_URL, payload, { headers } );
};

const getWishlist = (user) => {
  return axios.get(`${API_URL}/${user.id}`, { headers });
};

const removeFromWishlist = (user) => {
  return axios.delete(`${API_URL}/${user.id}`, { headers });
};

export default {
  addToWishlist, getWishlist, removeFromWishlist
};