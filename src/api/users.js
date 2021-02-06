import Config from 'react-native-config';
import apiRequest from './apiRequest';

export async function registerUser(user) {
  const {
    email,
    password,
    name,
    username,
    phone,
    address,
    address_state_id,
    address_city,
    address_colony,
    address_cp,
    namiUser1,
    namiUser2,
  } = user;
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    user: {
      email,
      password,
      name,
      username,
      phone,
      enabled: 1,
      userConfiguration: {
        alert911: 1,
        alertUser: 1,
      },
      address: {
        address,
        address_state_id,
        countryId: 1,
        address_cp,
        address_city,
        address_colony,
      },
      fcmToken: 'TOKEN',
      namiusers: [{ username: namiUser1 }, { username: namiUser2 }],
    },
  });

  console.log('raw create user', raw);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/register`,
    requestOptions,
    'registerUser',
  );
}

export async function changePassword({
  username, oldPassword, newPassword, token,
}) {
  console.log('changePassword JWT- ', token);

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token} `);

  const raw = JSON.stringify({ username, oldPassword, newPassword });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/changePassword`,
    requestOptions,
    'changePassword',
  );
}

export async function changePasswordWithCode({
  username, code, newPassword,
}) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    code, newPassword, oldPassword: 'a', username,
  });
  console.log('changePassowrdWithCode raw', raw);
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/changePasswordByCode`,
    requestOptions,
    'changePasswordByCode',
  );
}

export async function recoverPassword(username) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({ username });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/recoveryByCode`,
    requestOptions,
    'recoverPassword',
  );
}

export function verifyCredentials({ username, password }) {
  const myHeaders = new Headers();
  myHeaders.append('Cache-Control', 'no-cache');
  myHeaders.append('Authorization', 'Basic bmFtaXF1aS1mcm9udDpuYW1pcXVpMTIzNDU=');
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: `grant_type=password&username=${username}&password=${password}`,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/security/oauth/token`,
    requestOptions,
    'verifyCredentials',
  );
}

export function changeInfo(username, data, token) {
  console.log('token for modifying: ', token);
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  const {
    address,
    address_state_id,
    address_city,
    address_colony,
    address_cp,
    userImage,
    name,
    phone,
  } = data;

  const raw = JSON.stringify({
    address: address || ' ',
    address_state_id,
    address_city,
    address_colony,
    address_cp,
    userImage,
    name,
    phone,
    username,
  });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/updateInfo`,
    requestOptions,
    'changeInfo',
  );
}

export function changeNamiquiUsers(username, data, token) {
  const { namiUser1, namiUser2 } = data;

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({ namiusers: [{ username: namiUser1 }, { username: namiUser2 }], username });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/updateNamiusers`,
    requestOptions,
    'updateNamiusers',
  );
}

export function checkIfEmailExists(email) {
  const myHeaders = new Headers();

  const raw = '';

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/existEmail?email=${email}`,
    requestOptions,
    'checkIfEmailExists',
  );
}

export function updateFCMToken(username, newToken, JWT) {
  console.log('updating user FCM token');
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${JWT}`);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({ fmcToken: newToken, username });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return fetch(`${Config.NAMIQUI_GATEWAY}/api/users/updateToken`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log('updateFCMToken response', result);
      return result.data;
    })
    .catch((error) => console.log('error in updateFCMToken', error));
}

export function refreshJWT(refreshToken) {
  console.log('refresh token: ', refreshToken);

  const myHeaders = new Headers();
  myHeaders.append('Cache-Control', 'no-cache');
  myHeaders.append('Authorization', 'Basic bmFtaXF1aS1mcm9udDpuYW1pcXVpMTIzNDU=');
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    redirect: 'follow',
  };

  return fetch(`${Config.NAMIQUI_GATEWAY}/api/security/oauth/token`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log('refreshJWT', result);
      return result;
    })
    .catch((error) => console.log('error in refreshJWT', error));
}

export function sendAyudameAlert({
  token, username, lat, lng,
}) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');
  const now = new Date().toISOString();
  console.log(now, lat, lng, username);
  const raw = JSON.stringify({
    event_date: now, lat, lng, origin: username,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/core/alert`,
    requestOptions,
    'sendAyudameAlert',
  );
}

export function saveUserConfig({ username, configurations, token }) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({ username, configurations });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/configuration`,
    requestOptions,
    'saveUserConfig',
  );
}

export function getUserConfigs({ username, token }) {
  console.log('getuserconfig username', username);
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/users/configurations?username=${username}`,
    requestOptions,
    'getUserConfigs',
  );
}
