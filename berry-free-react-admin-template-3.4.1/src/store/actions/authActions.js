export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SET_API_KEY = 'SET_API_KEY';
export const LOGOUT = 'LOGOUT';
export const SET_REDIRECT_ROUTE = 'SET_REDIRECT_ROUTE';
export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: { user },
});

export const setApiKey = (apiKey) => ({
  type: SET_API_KEY,
  payload: { apiKey },
});

export const logout = () => ({
  type: LOGOUT,
});

export const setRedirectRoute = (route) => ({
  type: SET_REDIRECT_ROUTE,
  payload: route,
});