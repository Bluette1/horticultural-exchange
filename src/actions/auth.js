import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "./types";

import AuthService from "../services/auth.service";

export const register = (username, email, password) => (dispatch) => {
  return AuthService.register(username, email, password).then(
    (response) => {
      dispatch({
        type: REGISTER_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: REGISTER_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const login = (email, password) => (dispatch) => {
  return AuthService.login(email, password).then(
    (data) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const logout = (user) => (dispatch) => {

  if (user.created_at === null || user.id === null) {
    dispatch({
      type: LOGOUT,
    });
    return Promise.resolve();
  }
  return AuthService.logout()
  .then((data) => {
    dispatch({
      type: LOGOUT,
    });
    return Promise.resolve();
  },
  (error) => {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();

    dispatch({
      type: LOGOUT_FAIL,
    });

    dispatch({
      type: SET_MESSAGE,
      payload: message,
    });
    return Promise.reject(error);
  })
};
