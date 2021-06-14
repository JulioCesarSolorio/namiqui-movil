/*import React, { useEffect } from 'react';
import {
  View, Platform, DeviceEventEmitter, Linking, AppState,
} from 'react-native';
import {
  showFloatingBubble, requestPermission, checkPermission, initialize, hideFloatingBubble,
} from 'react-native-floating-bubble';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../../style';
import { NamiquiButton } from '../../styledComponents';

export function closeHelpButton() {
  if (Platform.OS === 'android') {
    initialize().then(() => {
      hideFloatingBubble().then(() => {
        console.log('Boton de ayuda removido');
      });
    }).catch(() => {
      console.log('no se logro inicializar el boton de ayuda');
    });
  }
}

export function showHelpButton() {
  if (Platform.OS === 'android') {
    initialize().then(() => {
      hideFloatingBubble().then(() => {
        setTimeout(() => {
          showFloatingBubble().then(() => {
            console.log('Mostrando el boton de ayuda');
          });
        }, 200);
      });
    }).catch(() => {
      console.log('no se logro inicializar el boton de ayuda');
    });
  }
}

export default function HelpButtonAndroid(props) {
  function initHelpFloatingButton() {
    // se verifica si se tiene el permiso para mostrar el boton de ayuda
    checkPermission().then(() => {
      // si no se tiene el permiso, solicitarlo
      requestPermission().then(() => {
        // una vez otorgado el permiso, mostrar el boton

        console.log('permiso otorgado');

        showHelpButton();
      })
        .catch(() => {
          console.log('Es necesario el permiso para mostrar el boton de ayuda');
        });
    }).catch(() => {
      // en caso de tenerlo mostrarlo
      showHelpButton();
    });
  }

  // eventos del boton de ayuda
  useEffect(() => {
    DeviceEventEmitter.addListener('floating-bubble-press', () => {
      console.log('click boton');
      console.log(AppState.currentState);

      switch (AppState.currentState) {
        case 'active':
          props.navigation.navigate('Pedir Ayuda');
          break;
        case 'background':
          Linking.openURL('namiqui://ayuda');
          setTimeout(() => {
            /*
            NO USAR (Funciona pero da muchos errores)
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'Pedir Ayuda' }],
            });
            */

            /*
            props.navigation.navigate('Pedir Ayuda');
          }, 500);
          break;
        case 'inactive':
          // si esta en segundo plano se debe de abrir la app indicando que redireccione a la pantalla de ayuda
          Linking.openURL('namiqui://ayuda');
          break;
        default:
          props.navigation.navigate('Pedir Ayuda');
      }
    });

    DeviceEventEmitter.addListener('floating-bubble-remove', () => {
      console.log('Boton removido');
    });
    return () => { };
  }, []);

  return (
    <View style={{
      flexDirection: 'row',
      flex: 12,
    }}
    >
      <View style={{
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <Icon
          name="exclamation-triangle"
          color={colors.COLOR_DANGER}
          size={30}
        />
      </View>
      <View style={{
        flex: 10,
      }}
      >
        <NamiquiButton
          onPress={() => initHelpFloatingButton()}
          style={{ width: '100%', minWidth: 220 }}
          textStyle={{ fontSize: 16 }}
          text="Mostrar Boton Ayudame"
        />
      </View>
    </View>

  );
}
*/
