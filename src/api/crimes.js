import Config from 'react-native-config';
import apiRequest from './apiRequest';
import defaultImage from '../assets/icons/delitos/default.png';
import REQAssets from '../assets/request/REQAssets';

export function getCrimeIcon(crime) {
  return (!crime.url_img_catalog) ? defaultImage : { uri: crime.url_img_catalog };
}

export function getCriminalActTypes(token) {
  const myHeaders = new Headers();

  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token} `);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  return apiRequest(
    `${Config.NAMIQUI_GATEWAY}/api/core/criminal-act/all`,
    requestOptions,
    'getCriminalActTypes',
  )
    .then((result) => {
      if (result !== undefined && !result.errors) {
        REQAssets.setCrimeActsTypes(result.data);
      } else {
        throw Error;
      }
      return result;
    })
    .catch((error) => {
      throw Error;
    });
}
