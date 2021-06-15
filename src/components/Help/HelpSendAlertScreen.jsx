import React, { useEffect, useState } from 'react';
import {
  Container, Content, Text,
} from 'native-base';
import { useSelector } from 'react-redux';
import {
  View, Vibration, ActivityIndicator,
} from 'react-native';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NamiquiButton } from '../styledComponents';
import { sendAyudameAlert } from '../../api/users';
import Gps from '../../gps/Gps';
import { colors } from '../../style';

export default function HelpSendAlertScreen({ navigation, route }) {
  // ============ USER =========
  const user = useSelector((state) => state.userReducers.user);
  const token = useSelector((state) => state.userReducers.JWT);
  const { username } = user;
  const { id } = user;
  let alertNamiquiUsertAttempts = 0;
  const MAX_NUMBER_ATTEMPTS_ALERT_NAMIQUI_USERS = 5;

  //= ============ ACTION REPORTS ============
  const [alertCall911Report, setCall911Report] = useState({
    status: 'COMPLETE',
    success: false,
    message: 'Llamada no realizada',
  });
  const [alertUsersNotificationReport, setUsersNotificationReport] = useState({
    status: 'LOADING',
    success: false,
    message: 'No se notificó a tus NamiquiUsers',
  });

  //= ============================== LLAMADA DE ALERTA ====================================

  function call911() {

    if (route.params && route.params.call911) {
      RNImmediatePhoneCall.immediatePhoneCall('911');
      setCall911Report({
        status: 'COMPLETE',
        success: true,
        message: 'Llamada realizada satisfactoriamente',
      });
    }
    else{ setCall911Report({
      status: 'COMPLETE',
      success: false,
      message: 'Llamada no configurada',
    });}
  }

  //= ================================ ALERTAR NAMIQUI USERS ====================================

  function alertNamiquiUsersSendPosition(lat, lng, message) {
    setUsersNotificationReport({
      status: 'LOADING',
      success: false,
      message: 'Enviando alertas . . . .',
    });

    sendAyudameAlert({
      token, id, lat, lng,
    }).then((response) => {
      if (response === undefined) {
        setUsersNotificationReport({
          status: 'LOADING',
          success: false,
          message: 'La aplicación no cuenta con conexión a Internet.',
        });

        // se intenta volver a enviar
        alertNamiquiUsersSendPosition(lat, lng, message);
      } else if (!response.errors) {
        // EXITTTO!!!
        setUsersNotificationReport({
          status: 'COMPLETE',
          success: true,
          message,
        });
      } else {
        setUsersNotificationReport({
          status: 'COMPLETE',
          success: false,
          message: response.errors.message,
        });
      }
    });
  }

  function alertNamiquiUsers() {
   
    if (route.params && route.params.alertNamiquiUsers) {
      alertNamiquiUsertAttempts += 1;

      if (alertNamiquiUsertAttempts < MAX_NUMBER_ATTEMPTS_ALERT_NAMIQUI_USERS) {
        setUsersNotificationReport({
          status: 'LOADING',
          success: false,
          message: `Alertar a tus NamiquiUsers - Obteniendo Ubicación  (Intento ${alertNamiquiUsertAttempts})`,
        });

        Gps.getGPSPosition((position) => {
          alertNamiquiUsersSendPosition(
            position.coords.latitude,
            position.coords.longitude,
            'Se notificó a tus NamiquiUsers que necesitas ayuda.',
          );
        },
        (error) => {
          setUsersNotificationReport({
            status: 'LOADING',
            success: false,
            message: `No fue posible obtener tu ubicación GPS (${error})`,
          });

          // si no se logo obtener la ubicacion se vuelve a intertar
          alertNamiquiUsers();
        });
      } else {
        // si no se logro obtener la ubicacion gps se envia la ultima obtenida
        Gps.getUserLastPosition((position) => {
          alertNamiquiUsersSendPosition(
            position.coords.latitude,
            position.coords.longitude,
            'Se notificó a tus NamiquiUsers que necesitas ayuda. (Se envió tu ultima ubicación registrada)',
          );
        },
        () => {
          setUsersNotificationReport({
            status: 'COMPLETE',
            success: false,
            message: `${alertUsersNotificationReport.message} (Intentos realizados ${alertNamiquiUsertAttempts})`,
          });
        });
      }
    } else {
      setUsersNotificationReport({
        status: 'COMPLETE',
        success: false,
        message: 'No se tenía activada la opción',
      });
    }
  }

  // =========================== Realizar actividades selecionadas =================================

  useEffect(() => {
    console.log(route.params);

    //Vibration.vibrate(2000);
    alertNamiquiUsertAttempts = 0;

    alertNamiquiUsers();
    call911();
  }, []);

  //= ===================================================== GUI =================================

  function alertActionDetail(action, report) {
    return (
      <View style={{
        backgroundColor: colors.COLOR_BACKGROUND_GRAY,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
      }}
      >
        <View style={{
          flexDirection: 'row',
        }}
        >
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
          >
            {(report.status === 'LOADING') && <ActivityIndicator size={30} color={colors.COLOR_SELECTED} />}
            {(report.status === 'COMPLETE' && report.success)
              && (
                <Icon
                  name="check"
                  color="green"
                  size={30}
                />
              )}
            {(report.status === 'COMPLETE' && !report.success)
              && (
                <Icon
                  name="times"
                  color={colors.COLOR_DANGER}
                  size={30}
                />
              )}

          </View>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <Text>
              {action}
            </Text>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          padding: 4,
        }}
        >
          <Text style={{
            fontSize: 10,
          }}
          >
            {report.message}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Container>
      <Content contentContainerStyle={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}
      >
        <View style={{
          padding: 20,
          marginTop: -30,
        }}
        >
          <View style={{
            marginBottom: 20,
          }}
          >
            <Text style={{
              fontSize: 38,
              textAlign: 'center',
              marginBottom: 30,
            }}
            >
              La ayuda ha sido solicitada
            </Text>
            <View>
              {alertActionDetail('Llamar al 911', alertCall911Report)}
              {alertActionDetail('Notificar a mis NamiquiUsers', alertUsersNotificationReport)}
            </View>
          </View>
        </View>
      </Content>
      {(alertCall911Report.status === 'COMPLETE' && alertUsersNotificationReport.status === 'COMPLETE')

        && (
          <View style={{
            padding: 10,
          }}
          >
            <NamiquiButton
              full
              style={{ margin: 10 }}
              onPress={() => {
                navigation.pop();
                navigation.navigate('Mapa Delictivo');
              }}
              text="Volver al Inicio"
            />
          </View>
        )}
    </Container>
  );
}
