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
import { closeHelpButton } from './HelpButton/HelpButtonAndroid';
import { createIconSetFromFontello } from 'react-native-vector-icons';

const Stack = createStackNavigator();

let actionCall911;
let actionAlertNamiquiUsers;

function HelpActionView({ navigation }) {
  //= ============= USER ==============
  const user = useSelector((state) => state.userReducers.user);

  //= ======================== USER ALERTS ======================
  const userConfig = useSelector((state) => state.userReducers.config);
  const { alert911, alertUser } = userConfig;
  const [call911, setCall911] = useState(true);
  const [alertNamiquiUsers, setAlertNamiquiUsers] = useState(true);
  console.log('current alert states - ', alert911, alertUser);
  //= ============== COUNTER =================
  const [alertCounter, setAlertCounter] = useState(10);
  const [alertSending, setAlertSending] = useState(false);
  let countdown = 10;

  /*
    aqui se setean las cofiguraciones de la BD
    */
  const initUserConfigurationActions = useCallback(
    () => {
      console.log('initUserConfigurationActions userConfig', userConfig);

      actionCall911 = userConfig ? alert911 !== 2 : 1; // user.configuration.CONF_CALL_911
      actionAlertNamiquiUsers = userConfig ? alertUser !== 2 : 1; // user.configuration.CONF_ALERT_NAMIQUI_USERS
      
      setCall911(actionCall911==1);
      setAlertNamiquiUsers(actionAlertNamiquiUsers==1);
    }, [userConfig, call911, alertUser],
  );

  function send() {
    setAlertSending(true);
    BackgroundTimer.stopBackgroundTimer();
    countdown = 10;
    navigation.navigate('Solicitud de Ayuda', {
      call911: actionCall911,
      alertNamiquiUsers: actionAlertNamiquiUsers,
    });
    
  }
  /*
    cada vez que se actualice el state, actualizar tambien los valores
    */
  useEffect(() => {
    actionCall911 = call911==1;
    actionAlertNamiquiUsers = alertNamiquiUsers==1;
  }, [call911, alertNamiquiUsers]);

  useFocusEffect(
    useCallback(() => {
      countdown = 10;
      closeHelpButton();
      initUserConfigurationActions();
      setAlertCounter(countdown);

      BackgroundTimer.runBackgroundTimer(() => {
        countdown -= 1;

        if (countdown >= 0 ) {
          if(!alertSending)
        {
          //Vibration.vibrate(100);
          setAlertCounter(countdown);
        }
        } else {
          if(!alertSending)
          {send();}
          BackgroundTimer.stopBackgroundTimer();
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
    setAlertSending(false);
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
              BackgroundTimer.stopBackgroundTimer();
              send();
              BackgroundTimer.stopBackgroundTimer();
            }}
          />
          <View>
            <TouchableOpacity onPress={() => {
               BackgroundTimer.stopBackgroundTimer();
              cancel();
              BackgroundTimer.stopBackgroundTimer();
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
