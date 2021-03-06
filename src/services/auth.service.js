import axios from 'axios';
import authHeader from './auth-header';
import { httpProtocol, host, port } from '../env.variables';

const API_URL = `${httpProtocol}://${host}:${port}`;
const headers = authHeader();

const register = (email, password) => axios.post(`${API_URL}/users/`, {
  email,
  password,
});
const namespace = (currentUser) => (currentUser.supervisor_role ? 'mod' : 'admin');

const registerUser = (payload, currentUser) => axios.post(`${API_URL}/${namespace(currentUser)}/users`, payload, {
  headers,
});

const deregister = (email, currentUser) => axios
  .get(`${API_URL}/${namespace(currentUser)}/users?email=${email}`, {
    headers,
  })
  .then((res) => axios.delete(
    `${API_URL}/${namespace(currentUser)}/users/${res.data.id}`,
    { headers },
  ));

const login = (email, password) => axios.post(`${API_URL}/users/sign_in`, {
  user: { email, password },
});

const logout = () => axios.delete(`${API_URL}/users/sign_out`, { headers });

export default {
  register,
  registerUser,
  deregister,
  login,
  logout,
};
