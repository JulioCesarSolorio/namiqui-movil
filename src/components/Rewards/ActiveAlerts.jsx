import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Container, Content, Text } from 'native-base';
import { NamiquiTitle } from '../styledComponents';
import { Alert, Image, Pressable, View } from 'react-native';
import { colors } from '../../style';

export default function ActiveAlerts({ navigation }) {
  const isFocused = useIsFocused();
  const [activeAlerts, setActiveAlerts] = useState();

  useEffect(() => {
    async function getActiveAlerts() {
      try {
        // get and process active rewards, then set them in state
        setActiveAlerts(
          {
            0: {
              name: 'Lucky',
              description: 'My favorite hat.',
              images: [
                'https://cdn.shopify.com/s/files/1/0401/1835/4086/products/gorra-black-clover-live-lucky-hat-cap-hat-premium-clover-2-29800651751590_1800x1800.jpg?v=1626290898',
                'https://cdn.shopify.com/s/files/1/0401/1835/4086/products/gorra-black-clover-live-lucky-hat-cap-hat-premium-clover-2-29800651620518_1800x1800.jpg?v=1626290898'
              ],
              address: 'PORFIRIO DIAZ 1550 COLONIA REVOLUCION CP 78214 PUEBLA PUEBLA.',
              amount: '500',
              coords: {"latitude": 37.41800509701347, "longitude": -122.07104243338107}
            },
            1: {
              name: 'Fizzers',
              description: 'My cat. He is orange and mean',
              images: [
                'https://excitedcats.com/wp-content/uploads/2020/10/Abyssinian-serious.webp',
              ],
              address: 'PORFIRIO DIAZ 1550 COLONIA REVOLUCION CP 78214 PUEBLA PUEBLA.',
              amount: '3000',
              coords: {"latitude": 37.41800509701347, "longitude": -122.07104243338107}
            }
          })
      } catch (e) {
        Alert.alert('problem', e);
      }
    }
    if (isFocused) {
      getActiveAlerts();
    }
  }, [isFocused]);

  function handlePressAlert(alert) {
    console.log('you touched an alert', alert);
    navigation.navigate('Alert Detail', { alert })
  }

  function ActiveAlertItem({ alert }) {
    return (
      <Pressable
        onPress={() => handlePressAlert(alert)}
        style={{
          height: 80,
          width: '80%',
          backgroundColor: colors.COLOR_DANGER,
          borderRadius: 25,
          borderWidth: 1,
          display: 'flex',
          alignItems: 'center',
          marginVertical: 10
        }}
      >
        <Text style={{ marginVertical: 10 }}>{alert.name}</Text>
        <Text style={{ marginVertical: 10 }}>{alert.amount}</Text>
      </Pressable>
    )
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Alertas Activas" />
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {activeAlerts && (
            Object.keys(activeAlerts).map((alertKey) => <ActiveAlertItem alert={activeAlerts[alertKey]} key={alertKey} />)
          )}
        </View>
      </Content>
    </Container>
  );
}