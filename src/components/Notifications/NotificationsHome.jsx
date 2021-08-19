import React, { useState, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { NamiquiTitle } from '../styledComponents';
import { colors } from '../../style';

export default function NotificationsHome({navigation}) {
  // Get notifications: maybe from props, maybe from selector? maybe from back?
  // const { notification } = props; ???
  // for now use dummy below

  const notifications = {
    0: {
      title: "Nueva Recompensa en tu area",
      text: "Usuario Batman lanzó una recompensa de $1000 por su bien 'Gorra de suerte'",
      image:  'https://cdn.shopify.com/s/files/1/0401/1835/4086/products/gorra-black-clover-live-lucky-hat-cap-hat-premium-clover-2-29800651751590_1800x1800.jpg?v=1626290898',
    },
    1: {
      title: "Nuevo objeto en venta",
      text: "Usuario Superman puso en la venta un nuevo objecto.",
      image:  'https://cdn.shopify.com/s/files/1/0401/1835/4086/products/gorra-black-clover-live-lucky-hat-cap-hat-premium-clover-2-29800651751590_1800x1800.jpg?v=1626290898',

    }
  }

  function handlePressNotification(notification) {
    console.log('you touched a notification', notification);
    navigation.navigate('Notification Detail', { notification })
  }

  function NotificationItem({ notification }) {
    return (
      <Pressable
        onPress={() => handlePressNotification(notification)}
        style={{
          width: '80%',
          backgroundColor: colors.COLOR_DANGER,
          borderRadius: 25,
          borderWidth: 1,
          display: 'flex',
          alignItems: 'center',
          marginVertical: 10,
          padding: 10
        }}
      >
        <Text style={{ marginVertical: 10 }}>{notification.title}</Text>
        <Text style={{ marginVertical: 10 }}>{notification.text}</Text>
      </Pressable>
    )
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Notificaciones" />
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {notifications && (
            Object.keys(notifications).map((notificationKey) => <NotificationItem notification={notifications[notificationKey]} key={notificationKey} />)
          )}
        </View>
      </Content>
    </Container>
  )
}