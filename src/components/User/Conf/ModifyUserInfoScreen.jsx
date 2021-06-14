import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container, Content, Form,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import {
  NamiquiButton, NamiquiTitle, NamiquiAlert,
} from '../../styledComponents';
import { changeInfo } from '../../../api/users';
import {
  UserInputName, UserAddressInputs, UserInputTelefono,
} from '../../elements/forms/formUserInputs';
import { InputGroupTitle } from '../../elements/forms/namiquiForm';
import failureIcon from '../../../assets/icons/alerta_2.png';
import successIcon from '../../../assets/icons/Icon_Verificacion.png';
import { updateUserInfo } from '../../../actions';
import { silentRefreshJWT } from '../../LogIn/logInUtils';
import UserImgSelector from '../../elements/forms/UserImgSelector';
import HelpButtonIOS from '../../Help/HelpButton/HelpButtonIOS';

export default function ModifyUserInfoScreen({ navigation }) {
  const dispatch = useDispatch();
  const showingIOSButton = useSelector((state) => state.userReducers.showIOSButton);
  const user = useSelector((state) => state.userReducers.user);
  const token = useSelector((state) => state.userReducers.JWT);
  const refreshToken = useSelector((state) => state.userReducers.refreshToken);
  const expirationDate = useSelector((state) => state.userReducers.JWTExpiration);
  const {
    control, handleSubmit, errors, setValue,
  } = useForm({
    defaultValues: user});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Alerta');
  const [alertImage, setAlertImage] = useState(failureIcon);
  const [alertText, setAlertText] = useState('Una alerta genérica');
  const [alertOnDismiss, setAlertOnDismiss] = useState(undefined);
  const [loading, setLoading] = useState(false);
  function closeModal() {
    setAlertVisible(false);
  }
  function goHome() {
    navigation.navigate('Home');
  }

  function sendToUserData(data) {
    console.log('setting user info to: ', data);
    setLoading(true);
    silentRefreshJWT(refreshToken, dispatch, expirationDate)
      .then(() => changeInfo(user.username, data, token)
        .then((result) => {
          setLoading(false);
          if (result === undefined) {
            setAlertVisible(true);
            setAlertTitle('Error');
            setAlertText('No tienes conexión a internet');
            setAlertImage(failureIcon);
          } else if (!result.errors) {
            console.log('changeInfo result', result);
            dispatch(updateUserInfo(result.data));
            setAlertVisible(true);
            setAlertTitle('¡Exito!');
            setAlertText('¡La modificación de tus datos fue exitoso!.');
            setAlertImage(successIcon);
            setAlertOnDismiss(() => goHome);
          } else {
            setAlertVisible(true);
            setAlertTitle('Error');
            setAlertText(result.errors.message);
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

        <NamiquiTitle
          text="Completa el formulario con tus datos"
          style={{
            fontSize: 22, color: '#fff', marginLeft: 10,
          }}
        />
        <Form>
          <InputGroupTitle title="Datos Personales" />
          <UserInputName control={control} errors={errors} />
          <UserImgSelector
            user={user}
            control={control}
            onSelectImage={(userImg) => {
              setValue('userImage', userImg.app_user_avatar_id, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setValue('user_image_url', userImg.user_image_url, {
                shouldValidate: true,
                shouldDirty: true,
              });
              console.log(userImg);
            }}
          />
          <InputGroupTitle title="Domicilio" />
          <UserAddressInputs control={control} errors={errors} />
          <InputGroupTitle title="Contacto" />
          <UserInputTelefono control={control} errors={errors} />
          <NamiquiButton
            style={{ marginTop: 50 }}
            full
            onPress={handleSubmit(sendToUserData)}
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
