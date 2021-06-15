import React, { useEffect } from 'react';
import {
  View, Platform, DeviceEventEmitter, Linking, AppState,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../../style';
import { NamiquiButton } from '../../styledComponents';

export function closeHelpButton() {

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
        
      </View>
    </View>

  );
}
