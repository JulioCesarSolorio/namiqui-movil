import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Text, Content,
} from 'native-base';
import {
  View, TouchableOpacity, Vibration,
} from 'react-native';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import { colors } from '../../style';
import { NamiquiButton } from '../styledComponents';
import { SwitchAction } from '../elements/forms/namiquiForm';
import NamiUserLabel, { getNamiusersUsernameInText } from '../elements/users/NamiUserLabel';
import HelpCancelScreen from './HelpCancelScreen';
import HelpSendAlertScreen from './HelpSendAlertScreen';
//import { closeHelpButton } from './HelpButton/HelpButtonAndroid';

const Stack = createStackNavigator();

let actionCall911;
let actionAlertNamiquiUsers;

function HelpActionView({ navigation }) {
  //= ============= USER ==============
  const user = useSelector((state) => state.userReducers.user);

  //= ======================== USER ALERTS ======================
  const userConfig = useSelector((state) => state.userReducers.config);
  const { CONF_ALERT_ACTION_CALL911, CONF_ALERT_ACTION_ALERT_USERS } = userConfig;
  const [call911, setCall911] = useState(true);
  const [alertNamiquiUsers, setAlertNamiquiUsers] = useState(true);
  console.log('current alert states - ', CONF_ALERT_ACTION_CALL911, CONF_ALERT_ACTION_ALERT_USERS);
  //= ============== COUNTER =================
  const [alertCounter, setAlertCounter] = useState(10);
  let countdown = 10;

  /*
    aqui se setean las cofiguraciones de la BD
    */
  const initUserConfigurationActions = useCallback(
    () => {
      console.log('initUserConfigurationActions userConfig', userConfig);

      actionCall911 = userConfig ? CONF_ALERT_ACTION_CALL911 !== 'false' : true; // user.configuration.CONF_CALL_911
      actionAlertNamiquiUsers = userConfig ? CONF_ALERT_ACTION_ALERT_USERS !== 'false' : true; // user.configuration.CONF_ALERT_NAMIQUI_USERS

      setCall911(actionCall911);
      setAlertNamiquiUsers(actionAlertNamiquiUsers);
    }, [userConfig, CONF_ALERT_ACTION_CALL911, CONF_ALERT_ACTION_ALERT_USERS],
  );

  function send() {
    BackgroundTimer.stopBackgroundTimer();
    navigation.navigate('Solicitud de Ayuda', {
      call911: actionCall911,
      alertNamiquiUsers: actionAlertNamiquiUsers,
    });
  }
  /*
    cada vez que se actualice el state, actualizar tambien los valores
    */
  useEffect(() => {
    actionCall911 = call911;
    actionAlertNamiquiUsers = alertNamiquiUsers;
  }, [call911, alertNamiquiUsers]);

  useFocusEffect(
    useCallback(() => {
      countdown = 10;
      //closeHelpButton();
      initUserConfigurationActions();
      setAlertCounter(countdown);

      BackgroundTimer.runBackgroundTimer(() => {
        countdown -= 1;
        if (countdown >= 0) {
          Vibration.vibrate(100);
          setAlertCounter(countdown);
        } else {
          send();
        }
      }, 1000);

      return () => {
        BackgroundTimer.stopBackgroundTimer();
      };
    }, [initUserConfigurationActions]),
  );

  function cancel() {
    BackgroundTimer.stopBackgroundTimer();
    countdown = 10;
    setAlertCounter(countdown);
    navigation.navigate('Cancelar Alerta');
  }

  return (
    <Container>
      <Content>
        <View style={{
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
        }}
        >
          <View>
            <Text style={{
              fontSize: 30,
            }}
            >
              ¡AYÚDAME!
            </Text>
          </View>
          <NamiUserLabel
            user={user}
          />
          <View style={{
            height: 120,
            width: 120,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            borderRadius: 60,
          }}
          >
            <Text style={{
              color: colors.COLOR_SELECTED,
              fontSize: 50,
              fontWeight: 'bold',
            }}
            >
              {alertCounter}
            </Text>
          </View>
          <View style={{ height: 30 }} />
          <SwitchAction
            enabled={call911}
            name="Llamar al 911"
            onPress={() => {
              setCall911((state) => !state);
            }}
          />
          <SwitchAction
            enabled={alertNamiquiUsers}
            name={`Alertar a: ${getNamiusersUsernameInText(user, { textDefault: 'No se mandaran alertas (Sin NamiquiUsers)' })}`}
            onPress={() => {
              setAlertNamiquiUsers((state) => !state);
            }}
          />
        </View>
        <View style={{
          padding: 40,
        }}
        >
          <NamiquiButton
            style={{ marginTop: 50, marginBottom: 50 }}
            full
            text={<Text>ENVIAR YA</Text>}
            onPress={() => {
              send();
            }}
          />
          <View>
            <TouchableOpacity onPress={() => {
              cancel();
            }}
            >
              <Text style={{ textAlign: 'center', textDecorationLine: 'underline' }}>Cancelar Alerta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Content>
    </Container>
  );
}

export default function HelpActionScreen() {
  return (
    <Stack.Navigator
      headerMode={false}
      headerStyle={{ height: 80 }}
      initialRouteName="Pedir Ayuda"
    >
      <Stack.Screen name="Pedir Ayuda" component={HelpActionView} />
      <Stack.Screen name="Solicitud de Ayuda" component={HelpSendAlertScreen} />
      <Stack.Screen name="Cancelar Alerta" component={HelpCancelScreen} />
    </Stack.Navigator>
  );
}
