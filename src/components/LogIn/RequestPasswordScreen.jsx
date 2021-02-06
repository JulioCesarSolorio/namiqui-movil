import React, { useState } from 'react';
import {
  Container, Content, CardItem,
} from 'native-base';
import { useForm } from 'react-hook-form';
import { changePasswordWithCode, recoverPassword } from '../../api/users';
import {
  NamiquiButton, NamiquiLogo, NamiquiTitle, NamiquiInputIcon, NamiquiAlert,
} from '../styledComponents';
import failureIcon from '../../assets/icons/alerta_2.png';
import successIcon from '../../assets/icons/Icon_Verificacion.png';
import IconUsername from '../../assets/icons/Icon_Username.png';
import { UserInputNamiquiUser } from '../elements/forms/formUserInputs';
import PasswordRecoveryModal from './PasswordRecoveryModal';

export default function RequestPasswordScreen({ navigation }) {
  const {
    control, handleSubmit, errors,
  } = useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [codeAlertVisible, setCodeAlertVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [connectionAlertVisible, setConnectionAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Alerta');
  const [alertImage, setAlertImage] = useState(failureIcon);
  const [alertText, setAlertText] = useState('Una alerta genérica');
  const [user, setUser] = useState('');
  const [step, setStep] = useState('enter code');
  const [loading, setLoading] = useState(false);

  function goHome() {
    console.log('go home callback');
    navigation.navigate('Ingresar');
  }

  function closeModal() {
    setModalVisible(false);
  }

  function closeAlert() {
    setCodeAlertVisible(false);
  }

  function closeSuccessAlert() {
    setSuccessAlertVisible(false);
  }

  function closeConnectionAlert() {
    setConnectionAlertVisible(false);
  }

  const handleBadCode = () => {
    setModalVisible(true);
    setStep('enter code');
  };

  function recover(data) {
    console.log('you clicked recover ');
    const { username } = data;
    setLoading(true);
    setUser(username);
    recoverPassword(username)
      .then((response) => {
        setLoading(false);
        if (!response) {
          setConnectionAlertVisible(true);
          setAlertTitle('Error');
          setAlertImage(failureIcon);
          setAlertText('No hay conexión al internet');
        } else if (response.data) {
          setModalVisible(true);
        } else {
          setConnectionAlertVisible(true);
          setAlertTitle('Error');
          setAlertImage(failureIcon);
          setAlertText('Hubo un problema intentando cambiar tu contraseña. Favor de intentar más tarde.');
        }
      });
  }

  function submitChangePassword(data) {
    const { newPassword, code } = data;
    setLoading(true);
    changePasswordWithCode({
      newPassword, code, username: user,
    })
      .then((response) => {
        setLoading(false);
        if (response === undefined) {
          setCodeAlertVisible(true);
          setAlertTitle('Error');
          setAlertText('No tienes conexión a internet');
          setAlertImage(failureIcon);
        } else if (response.errors) {
          setModalVisible(false);
          setCodeAlertVisible(true);
          setAlertTitle('Error');
          setAlertImage(failureIcon);
          setAlertText('El código no es correcto');
          throw Error;
        } else if (response && !response.error) {
          console.log('successfully changed password');
          setModalVisible(false);
          setSuccessAlertVisible(true);
          setAlertTitle('Éxito!');
          setAlertImage(successIcon);
          setAlertText('¡Se cambió tu contraeña exitosamente! Utiliza tu nombre de usuario y nueva contraseña para ingresar.');
        }
        return response;
      })
      .catch((error) => {
        console.log('changePasswordWithCode error', error);
        return error;
      });
  }

  return (
    <Container>
      <Content padder>
        <NamiquiTitle text="Ingresa tu nombre de usuario y recibirás las instrucciones para recuperar contraseña" />
        <NamiquiLogo style={{ marginBottom: 30, marginTop: 20 }} />
        <UserInputNamiquiUser
          control={control}
          errors={errors}
          name="username"
          placeholder="Nombre de usuario"
          defaultValue=""
          iconComponent={<NamiquiInputIcon source={IconUsername} />}
        />

        <NamiquiButton
          style={{ marginTop: 50 }}
          onPress={handleSubmit(recover)}
          text="Enviar"
          loading={loading}
        />
        <CardItem footer style={{ height: 400, backgroundColor: 'transparent' }} />
        <PasswordRecoveryModal
          visible={modalVisible}
          closeModal={closeModal}
          submitChangePassword={submitChangePassword}
          step={step}
          setStep={setStep}
          loading={loading}
        />
        {codeAlertVisible
          ? (
            <NamiquiAlert
              visible={codeAlertVisible}
              message={alertText}
              image={alertImage}
              title={alertTitle}
              closeModal={closeAlert}
              onDismiss={handleBadCode}
            />
          )
          : null}
        {successAlertVisible
          ? (
            <NamiquiAlert
              visible={successAlertVisible}
              message={alertText}
              image={alertImage}
              title={alertTitle}
              closeModal={closeSuccessAlert}
              onDismiss={goHome}
            />
          )
          : null}
        {connectionAlertVisible
          ? (
            <NamiquiAlert
              visible={connectionAlertVisible}
              message={alertText}
              image={alertImage}
              title={alertTitle}
              closeModal={closeConnectionAlert}
              onDismiss={goHome}
            />
          )
          : null}
      </Content>
    </Container>
  );
}
