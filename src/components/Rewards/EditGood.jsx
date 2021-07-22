import React, { useEffect, useState } from 'react';
import { Container, Content, Form, Text } from 'native-base';
import { NamiquiAlert, NamiquiButton, NamiquiInput, NamiquiTitle } from '../styledComponents';
import { Image, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import uuid from 'react-native-uuid';
import failureIcon from '../../assets/icons/alerta_2.png';
import successIcon from '../../assets/icons/Icon_Verificacion.png';
import RewardItemImage from './RewardItemImage';

export default function EditGood(props) {
  const { navigation, route } = props;
  const { params } = route;
  console.log('params', params);
  const { control, handleSubmit, errors } = useForm();
  const [registeredGoods, setRegisteredGoods] = useState();
  console.log('EditGood registeredGoods', registeredGoods);

  const [goodPhotos, setGoodPhotos] = useState(params?.good?.images || []);
  const [alertData, setAlertData] = useState({
    image: successIcon,
    title: "Éxito",
    message: "El registro del bien se guardó correctamente en el dispositivo",
    visible: false
  })

  function closeAlert() {
    setAlertData(data => ({ ...data, visible: false }))
  }

  useEffect(() => {
    async function getRegisteredGoods() {
      try {
        const jsonValue = await AsyncStorage.getItem('registeredGoods')
        jsonValue != null ? setRegisteredGoods(JSON.parse(jsonValue)) : null;
      } catch (e) {
        Alert.alert('problem', e);
      }
    }
    getRegisteredGoods();
  }, [])

  const storeRegisteredGoods = async (value) => {
    console.log('saving good in async storage', value)
    let fullRegistry = { ...registeredGoods };
    let goodId;
    params?.good ? goodId = params.good.goodId : goodId = uuid.v4();
    fullRegistry[goodId] = value;
    !fullRegistry[goodId].goodId ? fullRegistry[goodId].goodId = goodId : null;
    try {
      const jsonValue = JSON.stringify(fullRegistry)
      await AsyncStorage.setItem('registeredGoods', jsonValue);
      console.log('success saving good!');
      setAlertData({
        image: successIcon,
        title: "Éxito",
        message: "El registro del bien se guardó correctamente en el dispositivo",
        visible: true
      });
    } catch (e) {
      // saving error
      setAlertData({
        image: failureIcon,
        title: "Error",
        message: "No se guardó correctamente el registro del biene el dispositivo. Intenta de nuevo.",
        visible: true
      })
    }
  }

  function saveToRegistry(values) {
    console.log('save to registry recieves', values);
    const goodData = { ...values, images: goodPhotos };
    console.log('trying to save data', goodData)
    storeRegisteredGoods(goodData);
  }

  async function removeGood() {
    let fullRegistry = { ...registeredGoods };
    let id = params.good.goodId;
    delete fullRegistry[id];
    try {
      const jsonValue = JSON.stringify(fullRegistry)
      await AsyncStorage.setItem('registeredGoods', jsonValue);
      console.log('success saving good!');
      setAlertData({
        image: successIcon,
        title: "Éxito",
        message: "El bien ha sido borrado de tu registro",
        visible: true
      });
    } catch (e) {
      // saving error
      setAlertData({
        image: failureIcon,
        title: "Error",
        message: "No se borró correctamente el registro del biene en el dispositivo. Intenta de nuevo.",
        visible: true
      })
    }
  }

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

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <NamiquiTitle text={params?.good ? "Editar un bien" : "Registrar un bien"} />
          { params?.good && <NamiquiButton dark text="Borrar este bien" onPress={removeGood} style={{ width: '30%' }} textStyle={{ fontSize: 12 }} />}
        </View>
        <Form>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <NamiquiInput
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                placeholder="Nombre del bien"
              />
            )}
            name="name"
            rules={{
              required: true,
            }}
            defaultValue={params?.good?.name || ""}
          />
          {errors.name && errors.name.type === 'required' && <Text>Nombre del bien es un campo obligatorio</Text>}

          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <NamiquiInput
                multiline={true}
                onBlur={onBlur}
                onChangeText={(newValue) => onChange(newValue)}
                value={value}
                placeholder="Descripción del bien"
              />
            )}
            name="description"
            rules={{
              required: true,
            }}
            defaultValue={params?.good?.description || ""}
          />
          {errors.description && errors.description.type === 'required' && <Text>Descripción del bien es un campo obligatorio</Text>}

        </Form>
        {goodPhotos.length > 0 && <Text>Fotos para identificar el bien</Text>}
        <View>
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
            {goodPhotos.map((image, i) => <RewardItemImage source={{ uri: image }} key={i} />)}
          </View>
        </View>
        <NamiquiButton text="Usar foto de galería" onPress={handleLaunchImageLibrary} style={{ marginTop: 30 }} />
        <NamiquiButton text="Tomar foto" onPress={handleLaunchCamera} style={{ marginTop: 30 }} />
        <NamiquiButton text="Guardar Registro" onPress={handleSubmit(saveToRegistry)} style={{ marginTop: 50 }} />
        <NamiquiAlert image={alertData.image} title={alertData.title} message={alertData.message} closeModal={closeAlert} visible={alertData.visible} onDismiss={() => navigation.goBack()} />
      </Content>
    </Container>
  )
}