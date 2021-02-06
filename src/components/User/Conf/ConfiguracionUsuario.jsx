import { Container, Content, Form } from 'native-base';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../../actions';
import { changeNamiquiUsers } from '../../../api/users';
import { UserInputNamiquiUsers } from '../../elements/forms/formUserInputs';
import ProfileCard from '../../elements/users/ProfileCard';
import { silentRefreshJWT } from '../../LogIn/logInUtils';
import { NamiquiAlert, NamiquiButton, NamiquiTitle } from '../../styledComponents';
import failureIcon from '../../../assets/icons/alerta_2.png';
import successIcon from '../../../assets/icons/Icon_Verificacion.png';
import HelpButtonIOS from '../../Help/HelpButton/HelpButtonIOS';

export default function ConfiguracionUsuario({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducers.user);
  const showingIOSButton = useSelector((state) => state.userReducers.showIOSButton);
  const { username } = user;
  const refreshToken = useSelector((state) => state.userReducers.refreshToken);
  const expirationDate = useSelector((state) => state.userReducers.JWTExpiration);
  const JWT = useSelector((state) => state.userReducers.JWT);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Alerta');
  const [alertImage, setAlertImage] = useState(failureIcon);
  const [alertText, setAlertText] = useState('Una alerta genérica');
  const [alertOnDismiss, setAlertOnDismiss] = useState(undefined);
  const [loading, setLoading] = useState(false);

  function goHome() {
    navigation.navigate('Home');
  }

  function closeModal() {
    setAlertVisible(false);
  }

  const namiUsers = {};
  Object.keys(user.namiusers).forEach((k) => {
    namiUsers[`namiUser${parseInt(k, 10) + 1}`] = user.namiusers[k].username;
  });

  const { control, handleSubmit, errors } = useForm({
    defaultValues: namiUsers,
  });

  function sendNamiquiUsers(data) {
    setLoading(true);
    silentRefreshJWT(refreshToken, dispatch, expirationDate)
      .then(() => changeNamiquiUsers(user.username, data, JWT)
        .then((response) => {
          setLoading(false);
          if (response === undefined) {
            setAlertVisible(true);
            setAlertTitle('Error');
            setAlertText('No tienes conexión a internet');
            setAlertImage(failureIcon);
          } else if (!response.errors) {
            dispatch(updateUserInfo(response.data));
            setAlertVisible(true);
            setAlertTitle('¡Exito!');
            setAlertText('¡La modificación de tus NamiUsers fue exitoso!.');
            setAlertImage(successIcon);
            setAlertOnDismiss(() => goHome);
          } else {
            setAlertVisible(true);
            setAlertTitle('Error');
            setAlertText(response.errors.message);
            setAlertImage(failureIcon);
          }
        }))
      .catch(() => {
        setAlertVisible(true);
        setAlertTitle('Error');
        setAlertText('Hubo un problema renovando JWT');
        setAlertImage(failureIcon);
      });
  }

  return (
    <Container>
      <Content padder>
        <ProfileCard user={user} navigation={navigation} />
        <NamiquiTitle
          text="Configurar Alertas para mis NamiUsers:"
          style={{
            fontSize: 22, color: '#fff', marginLeft: 10,
          }}
        />
        <Form>
          <UserInputNamiquiUsers
            username={username}
            control={control}
            errors={errors}
            namiusersNum={2} // cambiar el 2 por el numero de inputs a imprimir
          />
          <NamiquiButton
            style={{ marginTop: 50 }}
            full
            onPress={handleSubmit(sendNamiquiUsers)}
            text="Guardar Cambios"
            loading={loading}
          />
        </Form>
        <NamiquiAlert
          visible={alertVisible}
          message={alertText}
          image={alertImage}
          title={alertTitle}
          closeModal={closeModal}
          onDismiss={alertOnDismiss}
        />
      </Content>
      <HelpButtonIOS navigation={navigation} showing={showingIOSButton} />
    </Container>
  );
}
