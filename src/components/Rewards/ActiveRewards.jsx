import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import { Alert, Image, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { colors } from '../../style';

export default function ActiveRewards({ navigation }) {
  const isFocused = useIsFocused();
  const [activeRewards, setActiveRewards] = useState();

  useEffect(() => {
    async function getActiveRewards() {
      try {
        // get and process active rewards, then set them in state
        setActiveRewards(
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
              claims: [
                {
                  claimId: 'REC-001',
                  namiUser: 'Robin',
                  namiUserPhone: '9991234567',
                  date: '7/28/21 11:23',
                  images: [
                    'https://images.unsplash.com/photo-1509366812838-b768dc7a8b3d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=667&q=80',
                  ],
                  address: 'PORFIRIO DIAZ 1550 COLONIA REVOLUCION CP 78214 PUEBLA PUEBLA',
                  coords: {"latitude": 37.41800509701347, "longitude": -122.07104243338107},
                  additionalInfo: 'Está ahi en el piso de una cochera.'
                }
              ]
            },
            1: {
              name: 'Fizzers',
              description: 'My cat. He is orange and mean',
              images: [
                'https://excitedcats.com/wp-content/uploads/2020/10/Abyssinian-serious.webp',
              ],
              address: 'PORFIRIO DIAZ 1550 COLONIA REVOLUCION CP 78214 PUEBLA PUEBLA.',
              amount: '3000'
            }
          })
      } catch (e) {
        Alert.alert('problem', e);
      }
    }
    if (isFocused) {
      getActiveRewards();
    }
  }, [isFocused]);

  function handlePressReward(reward) {
    console.log('you touched a reward', reward);
    navigation.navigate('Reward Detail', { reward })
  }

  function ActiveRewardItem({ reward }) {
    return (
      <Pressable
        onPress={() => handlePressReward(reward)}
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
        <Text style={{ marginVertical: 10 }}>{reward.name}</Text>
        <Text style={{ marginVertical: 10 }}>{reward.amount}</Text>
      </Pressable>
    )
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Recompensas Activas" />
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {activeRewards && (
            Object.keys(activeRewards).map((rewardKey) => <ActiveRewardItem reward={activeRewards[rewardKey]} key={rewardKey} />)
          )}
        </View>
      </Content>
    </Container>
  );
}
