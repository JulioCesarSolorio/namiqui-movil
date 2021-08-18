import React from 'react';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import { View } from 'react-native';
import RewardItemImage from './RewardItemImage';

export default function AlertDetail({ navigation, route }) {
  const { alert } = route?.params;
  console.log('alert', alert)
  const { name, description, images, address, amount } = alert;

  function handleClaimReward() {
    console.log('claiming reward');
    navigation.navigate('Claim Reward', { alert })
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text='Reclamo de Recompensa' />
        {alert ? (
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

            <NamiquiButton text="Reclamar Recompensa" onPress={handleClaimReward} style={{ marginVertical: 50 }} />
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
