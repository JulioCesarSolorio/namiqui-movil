import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NamiquiNavHeader from '../components/NamiquiNavHeader';
import NotificationsHome from '../components/Notifications/NotificationsHome';
import NotificationDetail from '../components/Notifications/NotificationDetail';

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
      <Stack.Screen name="Notifications Home" component={NotificationsHome} options={{ headerShown: false }} />
      <Stack.Screen name="Notification Detail" component={NotificationDetail} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
