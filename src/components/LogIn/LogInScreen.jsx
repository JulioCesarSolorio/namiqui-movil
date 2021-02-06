/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Pressable,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  Container, Content, Form, Text,
} from 'native-base';
import messaging from '@react-native-firebase/messaging';
import { useForm } from 'react-hook-form';
import {
  logIn, storeJWT, storeRefreshToken, storeUserConfig,
} from '../../actions/index';
import {
  getUserConfigs, updateFCMToken, verifyCredentials,
} from '../../api/users';
import { getExpirationDate } from './logInUtils';
import {
  NamiquiAlert,
  NamiquiButton,
  NamiquiInputIcon,
  NamiquiLogo,
  NamiquiTitle,
} from '../styledComponents';
import { UserInputPassword, UserInputUsername } from '../elements/forms/formUserInputs';
import IconUsername from '../../assets/icons/Icon_Username.png';
import IconPassword from '../../assets/icons/Icon_Password.png';
import failureIcon from '../../assets/icons/alerta_2.png';

function LogInScreen({ navigation }) {
  const dispatch = useDispatch();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Alerta');
  const [alertImage, setAlertImage] = useState(failureIcon);
  const [alertText, setAlertText] = useState('Una alerta genérica');
  const [alertOnDismiss] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, errors } = useForm();

  function closeModal() {
    setAlertVisible(false);
  }

  function onLoginButtonPress(data) {
    console.log('pressed log in', data);
    setLoading(true);
    verifyCredentials({ username: data.username, password: data.password })
      .then((response) => {
        setLoading(false);
        console.log('LogInScreen verification response', response);
        if (response === undefined || (!response.error && !response.info)) {
          setAlertVisible(true);
          setAlertTitle('Error');
          setAlertText('No tienes conexión a internet');
          setAlertImage(failureIcon);
        } else if (response && !response.error) {
          const token = response.access_token;
          const { username } = response.info;
          messaging()
            .getToken()
            .then((FCMtoken) => {
              console.log('FCM token on log in', FCMtoken);
              updateFCMToken(username, FCMtoken, token);
              return response;
            })
            .then((response) => getUserConfigs({ username: response.info.username, token }))
            .then((response) => {
              console.log('¡getUserConfigs Repsonse!', response);
              if (response && !response.error) {
                dispatch(storeUserConfig(response.data.configurations));
              }
            });
          dispatch(logIn({ ...response.info }));
          dispatch(storeJWT(response.access_token, getExpirationDate(response.expires_in)));
          dispatch(storeRefreshToken(response.refresh_token));
          console.log('navigating to user Home');
        } else if (response.error === 'unauthorized') {
          setAlertVisible(true);
          setAlertTitle('Error');
          setAlertText('El usuario no existe en los registros del sistema.');
          setAlertImage(failureIcon);
        } else if (response.error === 'invalid_grant' && response.error_description === 'Bad credentials') {
          setAlertVisible(true);
          setAlertTitle('Error');
          setAlertText('La contraseña no coincide.');
          setAlertImage(failureIcon);
        } else if (errors) {
          setAlertVisible(true);
          setAlertTitle('Error');
          setAlertText('Hay un problema con la conexión, por favor intenta más tarde.');
          setAlertImage(failureIcon);
        }
        return null;
      });
  }

  return (
    <Container>
      <Content padder contentContainerStyle={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <NamiquiTitle text="Hola de nuevo, nos alegra tenerte de vuelta." style={{ marginBottom: 60 }} />
        {/* <NamiquiCard>
          <CardItem> */}
        <NamiquiLogo />
        {/* </CardItem> */}
        <Form style={{ marginTop: 20 }}>
          <UserInputUsername
            control={control}
            errors={errors}
            iconComponent={<NamiquiInputIcon source={IconUsername} />}
          />
          <UserInputPassword
            errors={errors}
            control={control}
            placeholder="Password"
            name="password"
            iconComponent={<NamiquiInputIcon source={IconPassword} />}
          />

          <NamiquiButton
            full
            style={{ paddingVertical: 5, marginTop: 50 }}
            onPress={handleSubmit(onLoginButtonPress)}
            text="Ingresar"
            loading={loading}
          />
        </Form>

        <Pressable style={{ marginTop: 40, marginHorizontal: 70 }} onPress={() => navigation.navigate('Recuperar Contraseña')}>
          <Text style={{ textDecorationLine: 'underline', textAlign: 'center' }}>Recuperar mi contraseña</Text>
        </Pressable>
        <NamiquiAlert
          visible={alertVisible}
          message={alertText}
          image={alertImage}
          title={alertTitle}
          closeModal={closeModal}
          onDismiss={alertOnDismiss}
        />
      </Content>
    </Container>
  );
}

export default LogInScreen;
