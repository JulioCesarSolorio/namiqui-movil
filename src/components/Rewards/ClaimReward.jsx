import React, { useState } from 'react';
import { Container, Content, Form, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle, NamiquiInput, NamiquiAlert } from '../styledComponents';
import { Alert, Pressable, View } from 'react-native';
import RewardItemImage from './RewardItemImage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { colors } from '../../style';
import ErrorText from '../elements/forms/ErrorText';
import { useEffect } from 'react';
import { getRewardTermsAndConditions } from '../../api/assets';

export default function ClaimReward({ navigation, route }) {
  const { alert } = route?.params;
  console.log('ClaimReward reward', alert)
  const { name, amount } = alert;
  const [goodPhotos, setGoodPhotos] = useState([]);
  const [formValidationErrors, setFormValidaionErrors] = useState({});
  const { control, handleSubmit, errors } = useForm();
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [termsVisible, setTermsVisible] = useState(false);

  useEffect(() => {
    async function handleGetRewardTermsAndConditions() {
      let terms = await getRewardTermsAndConditions();
      setTermsAndConditions(terms);
    }
    // uncomment next line once API endpoint is made
    // handleGetRewardTermsAndConditions();

    // remove once API endpoint is made
    setTermsAndConditions('EL SERVICIO NAMIQUI RECOMPENSAS ES UNA PLATAFORMA DIGITAL DE COMPENSACION o GRATIFICACION POR APOYO EN LA LOCALIZACIÓN DE UN BIEN MATERIAL o ANIMAL EXTRAVIADO, INCLUYENDO PERSONAS CERCANAS AL NAMIUSER PRO REGISTRADO, NAMIQUI ES EL ENLACE ENTRE EL NAMIUSER PRO REGISTRADO EMISOR DE LA RECOMPENSA Y EL NAMIUSER PRO REGISTRADO RECEPTOR Y LOZALIZADOR DEL BIEN REGISTRADO . NAMIQUI NO TIENE RELACION PATRONAL CON LOS NAMIUSER´S REGISTRADOS. NAMIQUI COBRA UNA COMISION DEL 10% LIBRES DE IMPUESTOS POR EL MONTO DE LA RECOMPENSA, NAMIQUI RETIENE LOS IMPUESTOS CORRESPONDIENTES AL NAMIUSER Y LOS TRANSFIERE A LA AUTORIDAD TRIBUTARIA. NAMIQUI NOTIFICARA A LAS AUTORIDADES JUDICIALES CORRESPONDIENTES CUANDO DETECTE ACTIVIDAD DELICTIVA Y PROPORCIONARA LOS DATOS DEL USUARIO EN CASO DE REQUERIRSE, SIN NOTIFICARLO AL NAMIUSER.')
  }, []);

  function hideTerms() {
    setTermsVisible(false);
  }

  function handleLaunchCamera() {
    launchCamera(
      { mediaType: 'photo', saveToPhotos: true },
      (result) => {
        setGoodPhotos((old) => [...old, result.uri]);
        setFormValidaionErrors((state) => ({ ...state, photos: false }));
      }
    )
  }

  function handleLaunchImageLibrary() {
    launchImageLibrary(
      { mediaType: 'photo', saveToPhotos: true },
      (result) => {
        setGoodPhotos((old) => [...old, result.uri]);
        setFormValidaionErrors((state) => ({ ...state, photos: false }));
      }
    )
  }

  function handleClaimReward(value) {
    console.log('going to claim this reward', value);
    if (goodPhotos.length > 0) {
      // process images to send to back
      // send data to back to claim reward
      Alert.alert('Aqui se manda al back.')
    } else {
      setFormValidaionErrors((state) => ({ ...state, photos: true }))
    }
  }

  function goToTerms() {
    setTermsVisible(true);
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
        <NamiquiButton text="Tomar foto" onPress={handleLaunchCamera} style={{ marginVertical: 30 }} />
        {formValidationErrors.photos && <ErrorText>Fotos de prueba son requeridas.</ErrorText>}
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
          <Text>Dirección de la ubicación del bien encontrado: </Text>

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
          {errors.foundAddress && errors.foundAddress.type === 'required' && <Text style={{ color: colors.COLOR_DANGER }}>La dirección de donde se encuentra el bien es un campo obligatorio</Text>}
        </Form>
        {amount && <Text>Monto de recompensa: ${amount}</Text>}
        <NamiquiButton text="Enviar" onPress={handleSubmit(handleClaimReward)} style={{ marginVertical: 30 }} />
        <Pressable onPress={() => goToTerms()}>
          <Text style={{ textDecorationLine: 'underline', marginLeft: 5, fontSize: 12, marginBottom: 10}}>Acepto Términos y Condiciones Del Reclamo de Recompensa</Text>
        </Pressable>
        <NamiquiAlert
          title='TERMINOS Y CONDICIONES DEL RECLAMO DE LA RECOMPENSA'
          message={termsAndConditions} closeModal={hideTerms} visible={termsVisible}
        />
      </Content>
    </Container>
  )
}
