import GPSState from 'react-native-gps-state';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';

let isWatcherInitialized = false;

export default class Gps {
  static initWatchPosition() {
    GPSState.getStatus().then((status) => {
      switch (status) {
        case GPSState.AUTHORIZED:
        case GPSState.AUTHORIZED_ALWAYS:
        case GPSState.AUTHORIZED_WHENINUSE:
          if (!isWatcherInitialized) {
            console.log('---------  INIT WATCHER  -----------');
            Geolocation.watchPosition(
              (position) => {
                console.log('WATCHER UPDATE - LAT: ', position.coords.latitude, 'LNG: ', position.coords.longitude);
                this.saveLastPositionInStore(position);
                isWatcherInitialized = true;
              },
              (error) => {
                console.log('WATCHER ERROR: ', error);
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
                distanceFilter: 10,
                showLocationDialog: true,
              },
            );
          }
          break;
        default: console.log('Sin permiso GPS. No se inició watchPosotion');
      }
    });
  }

  static clearWatch() {
    console.log('CLEAR WATCH');
    Geolocation.clearWatch();
  }

  static getGPSPosition(successFunc, failFunc) {
    GPSState.getStatus().then((status) => {
      switch (status) {
        case GPSState.RESTRICTED:
        case GPSState.DENIED:
        case GPSState.NOT_DETERMINED:

          failFunc(this.getGPSErrorText(status));

          break;
        case GPSState.AUTHORIZED:
        case GPSState.AUTHORIZED_ALWAYS:
        case GPSState.AUTHORIZED_WHENINUSE:

          Geolocation.getCurrentPosition(
            (position) => {
              this.saveLastPositionInStore(position);
              successFunc(position);
            },
            (error) => {
              failFunc(error.message);
            },
            this.getGPSPositionConfigurations(),
          );

          break;
        default: console.log('getGPSPosition swtich cayó al Default');
      }
    });
  }

  static getGPSPositionConfigurations() {
    if (Platform.OS === 'android') {
      return {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        showLocationDialog: true,
      };
    }

    return {
      enableHighAccuracy: false,
      timeout: 10000,
      showLocationDialog: true,
    };
  }

  static getGPSErrorText(status) {
    switch (status) {
      case GPSState.RESTRICTED:
        return 'Sin GPS (Activa el sensor)';
      case GPSState.DENIED:
        return 'Sin GPS (No autorizado su uso en app)';
      case GPSState.NOT_DETERMINED:
        return 'Sin GPS (Permisos no solicitados)';
      default:
        return 'Sin GPS (Error desconocido)';
    }
  }

  static saveLastPositionInStore(position, FUNC_success = () => { }, FUNC_fail = () => { }) {
    AsyncStorage.setItem('USER_LAST_POSITION', JSON.stringify(position))
      .then(() => {
        FUNC_success();
      })
      .catch((error) => {
        console.log(error);
        FUNC_fail(error);
      });
  }

  static getUserLastPosition(FUN_callback = () => { }, FUNC_error = () => { }) {
    AsyncStorage.getItem('USER_LAST_POSITION')
      .then((value) => {
        FUN_callback(JSON.parse(value));
      })
      .catch((error) => {
        FUNC_error(error);
      });
  }
}
