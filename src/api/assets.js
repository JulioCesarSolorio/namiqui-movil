import Config from 'react-native-config';
import apiRequest from './apiRequest';

export function getAvatarList(token) {
  const myHeaders = new Headers();

  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token} `);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/admin/user-images-catalog/all`,
    requestOptions,
    'getAvatarList',
  );
}

export function getTermsAndConditions() {
  console.log('getting terms');
  const myHeaders = new Headers();

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/contract/term_condition`,
    requestOptions,
    'getTermsAndConditions',
  );
}

export function getRewardTermsAndConditions() {
  console.log('getting terms');
  const myHeaders = new Headers();

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/contract/term_condition_rewards`,
    requestOptions,
    'getTermsAndConditions',
  );
}