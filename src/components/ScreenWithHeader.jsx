import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NamiquiNavHeader from './NamiquiNavHeader';

const Stack = createStackNavigator();

export default function ScreenWithHeader({ screenComponent, screenName }) {
  return (
    <Stack.Navigator
      headerMode="screen"
      headerStyle={{ height: 80 }}
      initialRouteName={screenName}
      screenOptions={{
        header: ({ scene, previous, navigation }) => <NamiquiNavHeader authorized scene={scene} previous={previous} navigation={navigation} />,
      }}
    >
      <Stack.Screen name={screenName} component={screenComponent} />
    </Stack.Navigator>
  );
}
