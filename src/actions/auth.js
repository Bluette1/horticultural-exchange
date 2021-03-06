import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from './types';

import AuthService from '../services/auth.service';

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: { user },
});

export const loginFail = () => ({
  type: LOGIN_FAIL,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});

export const registerSuccess = () => ({
  type: REGISTER_SUCCESS,
});

export const registerFail = () => ({
  type: REGISTER_FAIL,
});

export const logout = (user) => (dispatch) => {
  if (user.created_at === undefined || user.id === undefined) {
    localStorage.removeItem('user');

    dispatch({
      type: LOGOUT,
    });
    return Promise.resolve();
  }
  return AuthService.logout().then(
    () => {
      localStorage.removeItem('user');

      dispatch({
        type: LOGOUT,
      });
      return Promise.resolve();
    },
    (error) => {
      const message = (error.response
        && error.response.data
        && error.response.data.message)
        || error.message
        || error.toString();

      dispatch({
        type: LOGOUT_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });
      return Promise.reject(error);
    },
  );
};

export const guestLogin = (data) => ({
  type: LOGIN_SUCCESS,
  payload: { user: data },
});
