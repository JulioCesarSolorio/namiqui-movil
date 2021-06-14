import React, { useCallback } from 'react';
import {
  View,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { colors } from '../style';
import { useSelector } from 'react-redux';

export default function HomeScreen({ navigation }) {
  const notification = useSelector((state) => state.userReducers.notification);
  console.log("HomeScreen notification", notification)

  if (!notification?.hasOwnProperty('newNotification') && notification?.notification?.title === "chat") {
    console.log('redirect from home to Chat with notification: ', notification);
    let { userId } = notification.data;
    navigation.navigate('Chat', {
      screen: 'Chat',
      params: { partnerId: userId, partnerImage: undefined, partnerName: undefined, messagesFirst: undefined },
    })
  }


  useFocusEffect(
    useCallback(() => {
      /*
      cuando se abre la app mediante el boton de ayuda flotante
      Linking.getInitialURL() obtiene la url o la ruta
      a la cual el usuario debe de ser redirijido.
      */

      Linking.getInitialURL().then((url) => {
        console.log('INITIAL ROUTE - HomeScreen', url);
        if (url === 'namiqui://ayuda') {
          navigation.navigate('Pedir Ayuda');
        } else {
          console.log('moving to map')
          console.log('HomeScreen Notification-', notification)
          navigation.navigate('Mapa Delictivo');
        }
      });
      return () => {
      };
    }, []),
  );

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.COLOR_BACKGROUND_GRAY_STRONG,
    }}
    >
      <ActivityIndicator size={50} color={colors.COLOR_SELECTED} />
    </View>
  );
}