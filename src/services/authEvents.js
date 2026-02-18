export const AUTH_EVENTS = {
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout'
};

export const emitLogin = () => {
  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGIN));
};

export const emitLogout = () => {
  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
};