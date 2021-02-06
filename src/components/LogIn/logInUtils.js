import { refreshJWT, registerUser } from '../../api/users';
import { storeJWT, storeRefreshToken } from '../../actions';
import failureIcon from '../../assets/icons/alerta_2.png';
import successIcon from '../../assets/icons/Icon_Verificacion.png';

function getExpirationDate(secondsToExpiration) {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + secondsToExpiration);
  console.log('jwt expiration date', expirationDate);
  return expirationDate;
}

function JWTWillExpire(expiration) {
  const now = new Date();
  const expirationDate = new Date(expiration);
  // console.log('checking if JWT will expire');
  now.setSeconds(0, 0);
  expirationDate.setSeconds(0, 0);
  if (expirationDate.getTime() <= now.getTime()) {
    // console.log('token will expire');
    return true;
  }
  // console.log('token will NOT expire');
  return false;
}

async function silentRefreshJWT(refreshToken, dispatch, expiration) {
  console.log('Checking if JWT will expire');

  if (JWTWillExpire(expiration)) {
    console.log('JWT will expire. Refreshing.');
    refreshJWT(refreshToken)
      .then((result) => {
        const newJWT = result.access_token;
        const newRefreshToken = result.refresh_token;
        const newExpiration = result.expires_in;
        console.log('silent refresh - new refreshtoken-', newRefreshToken);
        dispatch(storeJWT(newJWT, getExpirationDate(newExpiration)));
        dispatch(storeRefreshToken(newRefreshToken));
      });
  } else {
    console.log('JWT will not expire');
  }
}

function createNewUser({
  data, setAlertFunctions, setLoading, navigation = null,
}) {
  const {
    setAlertVisible,
    setAlertTitle,
    setAlertImage,
    setAlertText,
    setAlertOnDismiss,
  } = setAlertFunctions;
  console.log('creatNewUser', data);

  registerUser(data)
    .then((response) => {
      console.log('loginUtils CreateUser first response', response);
      setLoading(false);
      return response;
    })
    .then((response) => {
      if (response === undefined) {
        setAlertVisible(true);
        setAlertTitle('Error');
        setAlertText('No tienes conexión a internet');
        setAlertImage(failureIcon);
      } else if (response.errors === null) {
        setAlertVisible(true);
        setAlertTitle('¡Felicidades!');
        setAlertImage(successIcon);
        setAlertText('¡Ya estás registrado! Utiliza tu nombre de usuario y contraseña para ingresar.');
        setAlertOnDismiss(() => {
          navigation.navigate('Ingresar');
        });
      } else if (response.errors && response.errors.message === 'The email provided is not available.') {
        setAlertVisible(true);
        setAlertTitle('Error');
        setAlertImage(successIcon);
        setAlertText('El correo electronico ya está registrado.');
      } else {
        setAlertVisible(true);
        setAlertTitle('Error');
        setAlertImage(successIcon);
        setAlertText('No se pudo registrar en este momento. Intenta de nuevo luego.');
      }
    });
}

export {
  createNewUser, silentRefreshJWT, getExpirationDate, JWTWillExpire,
};
