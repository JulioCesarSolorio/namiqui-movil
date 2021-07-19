import React, { useState } from 'react';
import { Container, Content } from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import { View } from 'react-native';

export default function RewardsHome({ navigation }) {

  function handlePress() {
    console.log('You pressed a button');
  }

  function handleNavigate(screen){
    navigation.navigate(screen)
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content>
        <NamiquiButton text="Lanzar Recompensa" onPress={handlePress} style={{marginTop: 50}}/>
        <NamiquiButton text="Bienes Registrados" onPress={() => handleNavigate("Registered Goods")} style={{marginTop: 50}}/>
        <NamiquiButton text="Recompensas Activas" onPress={handlePress} style={{marginTop: 50}}/>
        <NamiquiButton text="Alertas Activas" onPress={handlePress} style={{marginTop: 50}}/>
        <NamiquiButton text="Iniciar Chat de Soporte" onPress={handlePress} style={{marginTop: 50}}/>
      </Content>
    </Container>
  )
}