import React from 'react';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import RewardItemImage from '../Rewards/RewardItemImage';
import { colors } from '../../style';
import { Alert, View } from 'react-native';

export default function NotificationDetail(props) {
  const { notification } = props.route?.params;
  console.log('notification', notification)
  const { title, image, text } = notification;

  function removeNotification(notification) {
    Alert.alert('¿Estás seguro que queires borrar esta notificación?')
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text='Notificación' />
        {notification && (
          <>
            {title && <Text>{title}</Text>}
            {image && (
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                <RewardItemImage source={{ uri: image }} />
              </View>
            )}
            {text && <Text>{text}</Text>}
            <NamiquiButton dark onPress={() => removeNotification(notification)} style={{ width: '30%', marginVertical: 25 }} text="Borrar" textStyle={{ color: colors.COLOR_DANGER }} />
          </>
        )}
      </Content>
    </Container>
  )
}