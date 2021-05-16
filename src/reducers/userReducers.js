import {
  LOGIN_SUCCESS,
  STORE_JWT,
  LOGOUT,
  STORE_REFRESH_TOKEN,
  UPDATE_USER_INFO,
  STORE_NOTIFICATION,
  STORE_USER_CONFIG,
  STORE_BUTTON_POSITION,
  STORE_SHOW_IOS_BUTTON,
} from '../actions';

let newState = {
  user: {
    email: 'Guest@gmail.com',
    password: 'Passw0rdEncriptado',
    name: 'Guest',
  },
};

export default function userReducers(state, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log('userReducers.js - verfied successfully', action);
      newState = { ...state, user: action.user };
      return newState;
    case LOGOUT:
      console.log('userReducers.js log out', action);
      newState = {};
      return newState;
    case STORE_JWT:
      console.log('storing JWT with Redux', action.JWT);
      console.log('storing JWTExpiration with Redux', action.JWTExpiration);

      newState = { ...state, JWT: action.JWT, JWTExpiration: action.JWTExpiration };
      return newState;
    case STORE_REFRESH_TOKEN:
      // console.log('storing refresh token with Redux:', action.refreshToken);
      newState = { ...state, refreshToken: action.refreshToken };
      return newState;
    case UPDATE_USER_INFO:
      console.log('Storing updated user info with redux:', action.userInfo);
      newState = { ...state, user: action.userInfo };
      return newState;
    case STORE_NOTIFICATION:
      console.log('storing notification with redux', action.notification);
      newState = { ...state, notification: action.notification };
      return newState;
    case STORE_USER_CONFIG:
      console.log('storing user config with redux', action.config);
      newState = { ...state, config: action.config };
      return newState;
    case STORE_BUTTON_POSITION:
      console.log('storing button positon with redux', action.buttonPosition);
      newState = { ...state, buttonPosition: action.buttonPosition };
      return newState;
    case STORE_SHOW_IOS_BUTTON:
      console.log('storing showIOSButton with redux', action.showIOSButton);
      newState = { ...state, showIOSButton: action.showIOSButton };
      return newState;
    default:
      console.log('userReducers.js - verfication failed');
      console.log(action.type);
      
      return state || newState;
  }
}
