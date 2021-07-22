import React, { useState } from 'react';
import { Container, Content, Form, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle, NamiquiInput } from '../styledComponents';
import { View } from 'react-native';
import RewardItemImage from './RewardItemImage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { colors } from '../../style';

export default function ClaimReward({ navigation, route }) {
  const { alert } = route?.params;
  console.log('ClaimReward reward', alert)
  const { name, amount } = alert;
  const [goodPhotos, setGoodPhotos] = useState([]);
  const { control, handleSubmit, errors } = useForm();

  function handleLaunchCamera() {
    launchCamera(
      { mediaType: 'photo', saveToPhotos: true },
      (result) => {
        setGoodPhotos((old) => [...old, result.uri])
      }
    )
  }

  function handleLaunchImageLibrary() {
    launchImageLibrary(
      { mediaType: 'photo', saveToPhotos: true },
      (result) => {
        console.log('assetArray', result)
        setGoodPhotos((old) => [...old, result.uri])
      }
    )
  }

  function handleClaimReward(value) {
    console.log('going to claim this reward', value);
    // process images to send to back
    // send data to back to claim reward
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Reclamo de Recompensa" />
        <NamiquiTitle text={`Reclamar recompensa de: ${name}`} style={{ fontSize: 18 }} />
        <Text>
          ESTE RECLAMO DE RECOMPENSA SOLO SE PUBLICARA AL NAMIUSER
          EMISOR DE LA ALERTA Y AL CALL CENTER DE NAMIQUI,
          ES REQUISITO ANEXAR FOTOGRAFIAS QUE PRUEBEN LA VERACIDAD DE LA INFORMACION.
        </Text>
        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
          {goodPhotos.map((image, i) => <RewardItemImage source={{ uri: image }} key={i} />)}
        </View>
        <NamiquiButton text="Usar foto de galería" onPress={handleLaunchImageLibrary} style={{ marginTop: 30 }} />
        <NamiquiButton text="Tomar foto" onPress={handleLaunchCamera} style={{ marginTop: 30 }} />
        <Text>Datos Adicionales: </Text>
        <Form>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <NamiquiInput
                multiline={true}
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                placeholder=""
              />
            )}
            name="info"
            rules={{
              required: true,
            }}
            defaultValue={""}
          />
          {errors.info && errors.info.type === 'required' && <Text style={{ color: colors.COLOR_DANGER }}>Información adicional del bien es un campo obligatorio</Text>}
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <NamiquiInput
                multiline={true}
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                placeholder=""
              />
            )}
            name="foundAddress"
            rules={{
              required: true,
            }}
            defaultValue={""}
          />
          {errors.foundAddress && errors.foundAddress.type === 'required' && <Text style={{ color: colors.COLOR_DANGER }}>La dirección donde se encuentra el bien es un campo obligatorio</Text>}
        </Form>
        {amount && <Text>Monto de recompensa: {amount}</Text>}
        <NamiquiButton text="Enviar" onPress={handleSubmit(handleClaimReward)} style={{ marginVertical: 30 }} />
      </Content>
    </Container>
  )
}
