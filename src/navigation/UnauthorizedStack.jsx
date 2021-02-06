import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NamiquiNavHeader from '../components/NamiquiNavHeader';
import LogInScreen from '../components/LogIn/LogInScreen';
import PersonalInfoScreen from '../components/LogIn/Registration/PersonalInfoScreen';
import PlanSelectionScreen from '../components/LogIn/Registration/PlanSelectionScreen';
import PaymentDetailsScreen from '../components/LogIn/Registration/PaymentDetailsScreen';
import TermsScreen from '../components/TermsScreen';
import StartScreen from '../components/LogIn/StartScreen';
import RequestPasswordScreen from '../components/LogIn/RequestPasswordScreen';
import QueEsUnNamiUser from '../components/LogIn/Registration/QueEsUnNamiUser';

const Stack = createStackNavigator();

export default function UnauthorizedStack({ initialRoute }) {
  return (
    <Stack.Navigator
      headerMode="screen"
      headerStyle={{ height: 80 }}
      initialRouteName={initialRoute}
      screenOptions={{
        header: ({ scene, previous, navigation }) => <NamiquiNavHeader scene={scene} previous={previous} navigation={navigation} />,
      }}
    >
      <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Ingresar" component={LogInScreen} />
      <Stack.Screen name="Mis Datos" component={PersonalInfoScreen} />
      <Stack.Screen name="Términos y Condiciones" component={TermsScreen} />
      <Stack.Screen name="¿Que Es Un NamiUser?" component={QueEsUnNamiUser} />
      <Stack.Screen name="Usuario NamiQui" component={PlanSelectionScreen} />
      <Stack.Screen name="Datos de pago" component={PaymentDetailsScreen} />
      <Stack.Screen name="Recuperar Contraseña" component={RequestPasswordScreen} />
    </Stack.Navigator>
  );
}
