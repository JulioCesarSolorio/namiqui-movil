import React, { useState } from 'react';
import { Container, Content, Form, Text } from 'native-base';
import { NamiquiButton, NamiquiInput, NamiquiTitle } from '../styledComponents';
import { Image, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function EditGood(props) {
  const { navigation, route } = props;
  const { params } = route;
  console.log('params', params);
  const { control, handleSubmit, errors } = useForm();
  const [goodPhotos, setGoodPhotos] = useState([]);

  function handleLaunchCamera() {
    launchCamera(
      { mediaType: 'photo', saveToPhotos: true },
      (result) => setGoodPhotos((old) => [...old, result.uri])
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

  function ItemImage(props) {
    return (
      <View style={{ height: 80, width: 80, margin: 20 }}>
        <Image
          source={props.source}
          style={{
            width: 80,
            height: 80,
          }}
        />
      </View>)
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
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
            name="goodName"
            rules={{
              required: true,
            }}
            defaultValue=""
          />
          {errors.goodName && errors.goodName.type === 'required' && <Text>Nombre del bien es un campo obligatorio</Text>}

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
            name="goodDescription"
            rules={{
              required: true,
            }}
            defaultValue=""
          />
          {errors.goodDescription && errors.goodDescription.type === 'required' && <Text>Descripción del bien es un campo obligatorio</Text>}

        </Form>
        {goodPhotos.length > 0 && <Text>Fotos para identificar el bien</Text>}
        <View>
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
            {goodPhotos.map((image, i) => <ItemImage source={{uri: image}} key={i} />)}
          </View>
        </View>
        <NamiquiButton text="Usar foto de galería" onPress={handleLaunchImageLibrary} style={{ marginTop: 50 }} />
        <NamiquiButton text="Tomar foto" onPress={handleLaunchCamera} style={{ marginTop: 50 }} />

      </Content>
    </Container>
  )
}