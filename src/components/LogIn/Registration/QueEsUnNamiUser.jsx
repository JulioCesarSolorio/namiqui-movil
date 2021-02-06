import React from 'react';
import { View, Image } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton } from '../../styledComponents';
import LogoGrey from '../../../assets/images/Namiqui_Grey.png';

export default function QueEsUnNamiUser({ route, navigation }) {
  return (
    <Container>
      <Content style={{ padding: 20 }}>
        <View style={{
          height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        >
          <Image source={LogoGrey} style={{ height: '40%', resizeMode: 'contain' }} />
        </View>
        <Text>
          {`Tu NamUser1 y NamiUser2 son usuarios de Namiqui app que recibiran tus alertas con tu ubicación GPS, puedes dar de alta a familiares o tu amigos mas cercanos para que te ubiquen en caso de presentarse
          alguna situación de emergencia.

          En caso de no contar con NamiUser1
          y NamiUser2 por el momento, puedes agregar a los usuarios
          NAMIUSER-VIRTUAL1  y  NAMIUSER-VIRTUAL2 para completar el registro, estos son usuarios en el call-center de Namiqui app que te apoyaran en caso de presentarse algún evento de emergencia y que te puedan ubicar; es importante dar de alta a la brevedad a tus NamiUser1 y NamiUser2 para que tengas completo a tu circulo de mas cercano de personas que te puedan ubicar y ayudar a la brevedad.

          En Namiqui PRO, puedes dar de alta
          hasta 6 Namiuser´s receptores de tus alertas.`}
        </Text>

        <NamiquiButton style={{ marginTop: 50, marginBottom: 50 }} full text="Entendido" onPress={() => navigation.goBack()} />

      </Content>
    </Container>
  );
}
