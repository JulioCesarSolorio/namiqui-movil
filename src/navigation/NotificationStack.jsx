import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NamiquiNavHeader from '../components/NamiquiNavHeader';
import RecievePushScreen from '../components/Help/RecievePushScreen';

const Stack = createStackNavigator();

export default function NotificationStack() {
  return (
    <Stack.Navigator
      headerMode="screen"
      headerStyle={{ height: 80 }}
      screenOptions={{
        header: ({ scene, previous, navigation }) => <NamiquiNavHeader scene={scene} previous={previous} navigation={navigation} />,
      }}
    >
      <Stack.Screen name="Recieve Push Screen" component={RecievePushScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
