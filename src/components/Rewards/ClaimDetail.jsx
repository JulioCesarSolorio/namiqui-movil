import React from 'react';
import { View, Linking, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { captureScreen } from "react-native-view-shot";
import CameraRoll from "@react-native-community/cameraroll";
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import RewardItemImage from './RewardItemImage';
import RewardMap from './RewardMap';

export default function ClaimDetail({ navigation, route }) {
  const claim = route.params.claim;
  console.log('ClaimDetail claim', claim);
  const { namiUser, address, additionalInfo, namiUserPhone, coords } = claim;

  function makeCall() {
    Linking.openURL(`tel:${namiUserPhone}`)
  }

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      console.log('hasAndroidPermission', hasPermission);
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    console.log('status', status)
    return status === 'granted';
  }
  
  async function savePicture(uri) {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      console.log('something is wrong')
      return;
    }
    console.log('we have permission. uri:', uri)
    CameraRoll.save(uri)
  };

  function screenCapture() {
    
    captureScreen({
      format: "jpg",
      quality: 0.8
    }).then(
      uri => {
        console.log("Image saved to", uri);
        savePicture(uri)
        Alert.alert('Pantalla caputrado y guardado en tus fotos');
      },
      error => console.error("Oops, snapshot failed", error)
    );
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text='Detalles Completos del Reclamo' />
        <Text style={{ marginVertical: 10 }}>{`EL NAMIUSER QUE LOCALIZÓ TU BIEN EXTRAVIADO ES: `}</Text>
        <Text style={{ marginVertical: 10 }}>{namiUser}</Text>
        <Text style={{ marginVertical: 10 }}>ESTE ES  SU NUMERO TELEFONICO</Text>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
          <Text style={{ marginVertical: 10 }}>{namiUserPhone}</Text>
          <NamiquiButton style={{ width: 150 }} text="LLamar" onPress={makeCall} />
        </View>
        <Text style={{ marginVertical: 10 }}>LA DIRECCION REPORTADA DE LA UBICACIÓN DE TU BIEN REGISTRADO ES:</Text>
        <Text style={{ marginVertical: 10 }}>{address}</Text>
        {coords && <RewardMap foundObject={true} lostObjectCoords={coords}/>}
        <Text style={{ marginVertical: 10 }}>Datos Adicionales</Text>
        <Text style={{ marginVertical: 10 }}>{additionalInfo}</Text>

        <NamiquiButton text="Captura Pantalla" onPress={screenCapture} />
      </Content>
    </Container>
  )
}
