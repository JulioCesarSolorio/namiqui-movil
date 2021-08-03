import React, { useState } from 'react';
import { Container, Content } from 'native-base';
import { NamiquiAlert, NamiquiButton, NamiquiTitle } from '../styledComponents';
import { Linking, View } from 'react-native';
import alertIcon from '../../assets/icons/Logo_icon.png';

export default function RewardsHome({ navigation }) {
  const [alertVisible, setAlertVisible] = useState(false);

  function handlePress() {
    console.log('You pressed a button');
  }

  function handleNavigate(screen) {
    navigation.navigate(screen)
  }

  function handleLaunchReward() {
    setAlertVisible(true);
  }

  function acceptTerms() {
    setAlertVisible(false);
    navigation.navigate('Launch Reward')
  }

  function handleOpenWhatsApp() {
    Linking.openURL('whatsapp://send?text=Hola&phone=3320341344');
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content>
        <NamiquiButton text="Lanzar Recompensa" onPress={handleLaunchReward} style={{ marginTop: 50 }} />
        <NamiquiButton text="Bienes Registrados" onPress={() => handleNavigate("Registered Goods")} style={{ marginTop: 50 }} />
        <NamiquiButton text="Recompensas Activas" onPress={() => handleNavigate("Active Rewards")} style={{ marginTop: 50 }} />
        <NamiquiButton text="Alertas Activas" onPress={() => handleNavigate("Active Alerts")} style={{ marginTop: 50 }} />
        <NamiquiButton text="Iniciar Chat de Soporte" onPress={handleOpenWhatsApp} style={{ marginTop: 50 }} />
        <NamiquiAlert
          image={alertIcon}
          message={`EL SERVICIO NAMIQUI RECOMPENSAS ES UNA PLATAFORMA DIGITAL DE COMPENSACION o GRATIFICACION POR APOYO EN LA LOCALIZACIÓN DE UN BIEN MATERIAL o ANIMAL EXTRAVIADO, INCLUYENDO PERSONAS CERCANAS AL NAMIUSER PRO REGISTRADO, NAMIQUI ES EL ENLACE ENTRE EL NAMIUSER PRO REGISTRADO EMISOR DE LA RECOMPENSA Y EL NAMIUSER PRO REGISTRADO RECEPTOR Y LOZALIZADOR DEL BIEN REGISTRADO . NAMIQUI NO TIENE RELACION PATRONAL CON LOS NAMIUSER´S REGISTRADOS. NAMIQUI COBRA UNA COMISION DEL 10% LIBRES DE IMPUESTOS POR EL MONTO DE LA RECOMPENSA, NAMIQUI RETIENE LOS IMPUESTOS CORRESPONDIENTES AL NAMIUSER Y LOS TRANSFIERE A LA AUTORIDAD TRIBUTARIA. NAMIQUI NOTIFICARA A LAS AUTORIDADES JUDICIALES CORRESPONDIENTES CUANDO DETECTE ACTIVIDAD DELICTIVA Y PROPORCIONARA LOS DATOS DEL USUARIO EN CASO DE REQUERIRSE, SIN NOTIFICARLO AL NAMIUSER.`}
          closeModal={() => setAlertVisible(false)}
          visible={alertVisible}
          onDismiss={acceptTerms}
          buttonText='Acepto' cancelable={true} cancelButtonText="Cancelar"
        />
      </Content>
    </Container>
  )
}