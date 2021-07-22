import React from 'react';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import { View } from 'react-native';
import RewardItemImage from './RewardItemImage';

export default function RewardDetail({ navigation, route }) {
  const { reward } = route?.params;
  console.log('reward', reward)
  const { name, description, images, address, amount } = reward;

  function handleRemoveReward() {
    console.log('removing reward');
    // Send request to back to remove this reward
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Recompensas Activas" />
        {reward ? (
          <>
            {name && <Text>Nombre del bien: {name}</Text>}
            {images && (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                {images.map((image, i) => <RewardItemImage source={{ uri: image }} key={`${name}-${i}`} />)}
              </View>
            )}
            {description && <Text>Datos generales: {description}</Text>}
            {address && <Text>Dirección del extravío: {address}</Text>}
            {amount && <Text>Monto de recompensa: {amount}</Text>}

            <NamiquiButton text="Borrar Recompensa" onPress={handleRemoveReward} style={{marginVertical: 50}}/>
          </>
        )
          : (
            <Text>Hubo un problema cargando la recompensa. Favor de intentar de nuevo</Text>
          )
        }
      </Content>
    </Container>
  );
}
