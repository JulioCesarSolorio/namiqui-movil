import React, { useState } from 'react';
import { Container, Content, Form, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle, NamiquiInput, NamiquiAlert, NamiquiLoadingOverlay } from '../styledComponents';
import { Linking } from 'react-native';

export default function GetMoreInfo() {
  return (
    <Container style={{ flexGrow: 1, position: 'relative' }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Solicitar más información" />

        <Text>TIENES EL DERECHO DE SOLICITAR MAYOR INFORMACION PARA VERIFICAR LA VERACIDAD DE LA MISMA, A CONTINUACION SE ABRIRA UNA COMUNICACIÓN VIA WHATSAPP CON NUESTRO CALL CENTER, TE SOLICITAREMOS TU NAMIUSER Y DATOS BASICOS DE VERIFICACION Y NOS COMUNICAREMOS CON EL NAMIUSER QUE HA REPORTADO LA LOCALIZACION DE TU BIEN EXTRAVIADO PARA SOLICITARLE RESPUESTA A TUS INTERROGANTES, ESTAMOS PARA SERVIRTE.</Text>
        <NamiquiButton style={{marginVertical: 20}} text="Abrir WhatsApp" onPress={() => Linking.openURL('whatsapp://send?text=Hola&phone=3320341344')} />
      </Content>
    </Container>
  )
}