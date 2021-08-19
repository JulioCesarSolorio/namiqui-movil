import React from 'react';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import { Alert, Pressable, View, Image } from 'react-native';
import RewardItemImage from './RewardItemImage';
import { colors } from '../../style';
import RewardMap from './RewardMap';

export default function RewardDetail({ navigation, route }) {
  const { reward } = route?.params;
  console.log('reward', reward)
  const { name, description, images, address, amount, claims, coords } = reward;

  function handleRemoveReward() {
    console.log('removing reward');
    // Send request to back to remove this reward
    Alert.alert('Se ha borrado correctamente la recompensa.', 'VERSION PRUEBA')
  }

  function goToClaim(claim) {
    navigation.navigate('Verify Claim', { claim, reward });
  }

  function ClaimButton({ claim }) {
    const { images, date } = claim;
    return (
      <Pressable
        onPress={() => goToClaim(claim)}
        style={{
          height: 80,
          width: '80%',
          backgroundColor: colors.COLOR_DANGER,
          borderRadius: 25,
          borderWidth: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginVertical: 10
        }}
      >
        {images && (
          <View style={{ margin: 10, height: 60, width: 60 }}>
            <Image style={{ height: '100%', width: '100%' }} source={{ uri: images[0] }} />
          </View>
        )}
        {date && <Text>{date}</Text>}
      </Pressable>
    )
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Detalle de Recompensa" />
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
            {coords && <RewardMap lostObjectCoords={coords}/>}
            {amount && <Text>Monto de recompensa: {amount}</Text>}
            {claims && (
              <>
                <Text style={{marginTop: 25}}>Reclamos de la Recompensa</Text>
                {claims.map((claim, i) => <ClaimButton key={`claim-${i}`} claim={claim} />)}
              </>
            )}

            <NamiquiButton text="Borrar Recompensa" onPress={handleRemoveReward} style={{ marginVertical: 50 }} />
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
