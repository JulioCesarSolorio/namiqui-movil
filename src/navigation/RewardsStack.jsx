import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NamiquiNavHeader from '../components/NamiquiNavHeader';
import RewardsHome from '../components/Rewards/RewardsHome';
import RegisteredGoods from '../components/Rewards/RegisteredGoods';
import EditGood from '../components/Rewards/EditGood';

const Stack = createStackNavigator();

export default function RewardsStack() {
  return (
    <Stack.Navigator
      headerMode="screen"
      headerStyle={{ height: 80 }}
      screenOptions={{
        header: ({ scene, previous, navigation }) => <NamiquiNavHeader scene={scene} previous={previous} navigation={navigation} />,
      }}
    >
      <Stack.Screen name="Rewards" component={RewardsHome} options={{ headerShown: false }} />
      <Stack.Screen name="Registered Goods" component={RegisteredGoods} options={{ headerShown: false }} />
      <Stack.Screen name="Edit Good" component={EditGood} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}
