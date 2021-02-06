export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const STORE_JWT = 'STORE_JWT';
export const LOGOUT = 'LOGOUT';
export const STORE_REFRESH_TOKEN = 'STORE_REFRESH_TOKEN';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const STORE_NOTIFICATION = 'STORE_NOTIFICATION';
export const STORE_USER_CONFIG = 'STORE_USER_CONFIG';
export const STORE_BUTTON_POSITION = 'STORE_BUTTON_POSITION';
export const STORE_SHOW_IOS_BUTTON = 'STORE_SHOW_IOS_BUTTON';

export function logIn(user) {
  // if API call is successfull
  console.log('login action user', user);
  if (Object.keys(user).length !== 0 && user.constructor === Object) {
    return {
      type: LOGIN_SUCCESS,
      user,
    };
  }
  return {
    type: LOGIN_ERROR,
  };
}

export function logOut() {
  console.log('logOut action');
  return {
    type: LOGOUT,
  };
}

export function storeJWT(token, expirationDate) {
  console.log('ACTION: storing jwt and expiration', expirationDate);
  return {
    type: STORE_JWT,
    JWT: token,
    JWTExpiration: expirationDate,
  };
}

export function storeRefreshToken(token) {
  console.log('storeRefreshToken', token);
  return {
    type: STORE_REFRESH_TOKEN,
    refreshToken: token,
  };
}

export function updateUserInfo(newUserInfo) {
  console.log('updateUserInfo with', newUserInfo);
  return {
    type: UPDATE_USER_INFO,
    userInfo: newUserInfo,
  };
}

export function storeNotification(newNotification) {
  console.log('storeNotification action', newNotification);
  return {
    type: STORE_NOTIFICATION,
    notification: newNotification,
  };
}

export function storeUserConfig(newConfig) {
  console.log('storeUserConfig action', newConfig);
  return {
    type: STORE_USER_CONFIG,
    config: newConfig,
  };
}

export function storeShowiOSButton(bool) {
  console.log('showiOSButton action', bool);
  return {
    type: STORE_SHOW_IOS_BUTTON,
    showIOSButton: bool,
  };
}

export function storeButtonPosition(newPosition) {
  console.log('storeButtonPosition action', newPosition);
  return {
    type: STORE_BUTTON_POSITION,
    buttonPosition: newPosition,
  };
}
