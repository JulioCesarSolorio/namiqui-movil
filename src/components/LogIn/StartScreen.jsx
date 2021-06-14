import React, { useEffect } from 'react';
import {
  View,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  Container, Content, Text,
} from 'native-base';
import { request, PERMISSIONS } from 'react-native-permissions';
import LogoGrey from '../../assets/images/Namiqui_Grey.png';
import { NamiquiButton } from '../styledComponents';

export default function StartScreen({ navigation }) {
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.CALL_PHONE
          ],
          {
            title: 'Permitir que NamiQui usa tu ubicación y hace llamadas',
            message:
              'Namiqui necesitar tu ubicación '
              + 'y poder hacer llamadas'
              + 'para ayudarte en una emergencia.',
            buttonNeutral: 'Pregunta luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        console.log('permissions result', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Se puede usar GPS y hacer llamadas');
        } else {
          console.log('Permisos denegados');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          console.log('ios permission result', result);
        })
        .catch((error) => console.warn(error));
    }
  };

  useEffect(() => { requestPermissions(); }, []);
  return (
    <Container>
      <Content contentContainerStyle={{ flex: 1 }} padder>
        <View style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        >
          <Image source={LogoGrey} style={{ height: '30%', resizeMode: 'contain', paddingLeft: 20 }} />
        </View>
        <View style={{ flex: 1 }}>
          <NamiquiButton
            full
            style={{ margin: 10 }}
            onPress={() => navigation.navigate('Mis Datos')}
            text="Registrarme"
          />
          <NamiquiButton
            full
            style={{ margin: 10 }}
            onPress={() => navigation.navigate('Ingresar')}
            text="Ingresar"
          />
        </View>
      </Content>
      <View style={{ padding: 10 }}>
        <Text>Versión 1.0</Text>
      </View>
    </Container>
  );
}
