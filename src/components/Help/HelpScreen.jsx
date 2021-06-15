import React, { useState } from 'react';
import {
  Container, View, Text, Content,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../../style';
import HelpButton from './HelpButton/HelpButton';
import HelpButtonIOS from './HelpButton/HelpButtonIOS';
import { SwitchAction } from '../elements/forms/namiquiForm';
import { getNamiusersUsernameInText, NamiusersLabels } from '../elements/users/NamiUserLabel';
import { NamiquiAlert, NamiquiButton } from '../styledComponents';
import failureIcon from '../../assets/icons/alerta_2.png';
import successIcon from '../../assets/icons/Icon_Verificacion.png';
import { saveUserConfig } from '../../api/users';
import { storeUserConfig } from '../../actions';

export default function HelpScreen({ navigation }) {
  const dispatch = useDispatch();
  const [showingHelpButton, setShowingHelpButton] = useState(false);
  const showingIOSButton = useSelector((state) => state.userReducers.showIOSButton);
  const user = useSelector((state) => state.userReducers.user);
  const { username } = user;
  const token = useSelector((state) => state.userReducers.JWT);
  const userConfig = useSelector((state) => state.userReducers.config);
  const [callEnabled, setCallEnabled] = useState(userConfig ? userConfig.alert911 !== 2 : true);
  const [notificationEnabled, setNotificationEnabled] = useState(userConfig ? userConfig.alertUser !== 2 : true);
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

  function saveSettings() {
    const now = new Date().toISOString();
    console.log(userConfig);
    const configurations = 
      {
        alertUser:  notificationEnabled ? 1 : 2,
        alert911:  callEnabled ? 1 : 2,
        userId:userConfig.userId,
        created: now
      }
     
    ;
    setLoading(true);
    console.log("JRC Checale aqui!!!");
    console.log(userConfig);
    saveUserConfig({ username, configurations, token })
      .then((response) => {
        // on response of API call
        console.log('saveUerCongif response !!!', response.errors);
        setLoading(false);
        if (response && response.errors === null) {
          dispatch(storeUserConfig(response.data.configurations));
          setAlertVisible(true);
          setAlertTitle('¡Exito!');
          setAlertText('¡Se guardaron tus preferencias!');
          setAlertImage(successIcon);
          setAlertOnDismiss((state) => goHome);
        } else {
          setAlertVisible(true);
          setAlertTitle('Error');
          setAlertText('Hubo un error guardando tus ajustes. Favor de intentar luego.');
          setAlertImage(failureIcon);
        }
      });
  }

  return (
    <Container>
      <Content>
        <View style={{
          padding: 20,
        }}
        >
          <HelpButton navigation={navigation} showingHelpButton={showingHelpButton} setShowingHelpButton={setShowingHelpButton} showingIOSButton={showingIOSButton} dispatch={dispatch} />
          <View style={{
            marginVertical: 20,
            marginBottom: 30,
          }}
          >
            <Text style={{ fontSize: 18 }}>
              Al oprimir el botón se mandara una solicitud de apoyo a tus contactos registrados inicialmente en la
              <Text style={{ color: colors.COLOR_SELECTED, fontSize: 18 }}>
                {` CONFIGURACIÓN ${getNamiusersUsernameInText(user)} `}
              </Text>
              recibirán tu ubicación actual y deberás seleccionar el tipo de alerta rápidamente para que tus contactos te apoyen lo antes posible.
            </Text>
            <Text style={{ fontSize: 18, marginTop: 4 }}>
              <Text style={{ color: colors.COLOR_SELECTED, fontSize: 18 }}>Tienes 10 segundos </Text>
              para seleccionar el tipo de alerta, cancelar o reafirmar la alerta, en caso contrario al termino de los 10 segundos se tomara como alerta roja automáticamente,
              por lo que cualquiera de tus 2 contactos seleccionados deberán marcar al 911 para informar sobre la situación.
            </Text>

          </View>
          <View>
            <Text style={{
              fontSize: 24,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
            >
              Selecciona el tipo de alerta de auxilio y acciones por default
            </Text>
          </View>
          <View style={{
            marginBottom: 30,
          }}
          >
            <SwitchAction
              enabled={callEnabled}
              name="Llamar al 911"
              onPress={() => {
                setCallEnabled((state) => !state);
              }}
            />
            <SwitchAction
              enabled={notificationEnabled}
              name={`Alertar a ${getNamiusersUsernameInText(user, { textDefault: 'No se mandaran alertas (Sin NamiquiUsers)' })}`}
              onPress={() => {
                setNotificationEnabled((state) => !state);
              }}
            />
            <View style={{
              paddingTop: 10,
            }}
            >
              <NamiquiButton
                full
                style={{ margin: 10 }}
                onPress={saveSettings}
                text="Guardar"
                loading={loading}
              />
            </View>
          </View>
          <View>
            <Text style={{
              fontSize: 24,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
            >
              Namiusers receptores de tus alertas
            </Text>
            <NamiusersLabels user={user} />
          </View>
          <View style={{
            marginVertical: 20,
          }}
          >
            <Text style={{ fontSize: 18 }}>
              La activación de las alertas ociosas o las mal intencionadas pueden provocar el desvió de recursos económicos y humanos por lo que en caso de detectarse una irresponsabilidad
              por parte de un Namuser este será sancionado con la desactivación de su cuenta en todas las plataformas de Namiqui.
            </Text>
          </View>
        </View>
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
