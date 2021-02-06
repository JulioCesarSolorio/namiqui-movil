import Config from 'react-native-config';

export function checkIfUserExists(username) {
  const raw = '';

  const requestOptions = {
    method: 'GET',
    body: raw,
    redirect: 'follow',
  };

  return fetch(`${Config.NAMIQUI_GATEWAY}/api/users/existUsername?username=${username}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log('checkIfUserExists response', result);
      return result.data;
    })
    .catch((error) => console.log('error in checkIfUserExists', error));
}

export function emptyFunction() {
}
