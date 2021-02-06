import React, { useCallback } from 'react';
import {
  View,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../style';

export default function HomeScreen({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      /*
      cuando se abre la app mediante el boton de ayuda flotante
      Linking.getInitialURL() obtiene la url o la ruta
      a la cual el usuario debe de ser redirijido.
      */

      Linking.getInitialURL().then((url) => {
        console.log('INITIAL ROUTE', url);
        if (url === 'namiqui://ayuda') {
          navigation.navigate('Pedir Ayuda');
        } else {
          navigation.navigate('Mapa Delictivo');
        }
      });
      return () => {
      };
    }, []),
  );

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.COLOR_BACKGROUND_GRAY_STRONG,
    }}
    >
      <ActivityIndicator size={50} color={colors.COLOR_SELECTED} />
    </View>
  );
}
