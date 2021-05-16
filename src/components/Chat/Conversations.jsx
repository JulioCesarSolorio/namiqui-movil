import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../style';
import 'dayjs/locale/es';
import { FlatList, Image, Pressable, NativeEventEmitter, NativeModules } from 'react-native';
import { getUserByUsername } from '../../api/users';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Content, View, Text } from 'native-base';
import { getConversations, getMessages } from '../../api/chat';
import dayjs from 'dayjs';
import { storeNotification } from '../../actions';

export default function ConversationsScreen({ navigation }) {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.userReducers.notification);
  const token = useSelector((state) => state.userReducers.JWT);
  const user = useSelector((state) => state.userReducers.user);
  const userId = user.id;
  const namiUser1 = user.namiusers[0];
  const namiUser2 = user.namiusers[1];
  const convo1 = { "id": namiUser1.idUser, "name": namiUser1.name, "username": namiUser1.username };
  const convo2 = { "id": namiUser2.idUser, "name": namiUser2.name, "username": namiUser2.username };
  const [conversations, setConversations] = useState([convo1, convo2]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [partnerImages, setPartnerImages] = useState({});
  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (notification) {
      getConversations({ token, userId, requestedPage: page })
        .then((response) => {
          let newConversations = [...response.data.recipients];
          if (!newConversations.find(el => el.id === convo2.id)) {
            newConversations.unshift(convo2)
          }
          if (!newConversations.find(el => el.id === convo1.id)) {
            newConversations.unshift(convo1)
          }
          setConversations(newConversations)
        })
        .catch((error) => console.log('getConversations error', error));
    }
  }, [notification])

  useFocusEffect(
    useCallback(() => {
      let readNotification = { ...notification };
      readNotification.newNotification = false;
      dispatch(storeNotification(readNotification));
      getConversations({ token, userId, requestedPage: page })
        .then((response) => {
          let newConversations = [...response.data.recipients];
          if (!newConversations.find(el => el.id === convo2.id)) {
            newConversations.unshift(convo2)
          }
          if (!newConversations.find(el => el.id === convo1.id)) {
            newConversations.unshift(convo1)
          }
          setConversations(newConversations)
        })
        .catch((error) => console.log('getConversations error', error));
    }, [])
  );

  function getUsersByUsernames(conversations) {
    conversations.forEach((conversation) => {
      if (!partnerImages[conversation.username]) {
        getUserByUsername({ token, username: conversation.username })
          .then((response) => setPartnerImages((state) => {
            return { ...state, [conversation.username]: response.avatar.image_url }
          }))
          .catch((error) => console.log('getUserByUsername error', error))
      }
    })
  }

  function getMessagesByPartnerId(conversations) {
    conversations.forEach((conversation) => {
      console.log('conversation', conversation)
      let username = conversation.username;
      console.log('partnerImages[username]', partnerImages[username])

      getMessages({ token, userId, partnerId: conversation.id, requestedPage: page })
        .then((response) => {
          let newMessages = [];
          if (response.data) {
            response.data.messages.forEach((message) => {
              newMessages.push({
                _id: message.id,
                text: message.text,
                createdAt: message.createdAt,
                user: {
                  _id: message.userId,
                  name: username,
                  avatar: partnerImages[username],
                },
              });
              setMessages((state) => {
                return { ...state, [message.userId]: newMessages }
              });
            });
          }
        })
        .catch((error) => console.log('getMessages error', error))

    })
  }

  useEffect(() => {
    getUsersByUsernames(conversations);
    getMessagesByPartnerId(conversations);
  }, [conversations]);

  const renderSeparator = ({ leadingItem }) => (
    <View
      style={{
        alignSelf: 'center',
        width: '90%',
        height: 2,
        backgroundColor: colors.COLOR_DANGER
      }}
    />
  );
  function getParsedDate(date){
    date = String(date).split(' ');
    var days = String(date[0]).split('-');
    var hours = String(date[1]).split(':');
    return [parseInt(days[0]), parseInt(days[1])-1, parseInt(days[2]), parseInt(hours[0]), parseInt(hours[1]), parseInt(hours[2])];
  }
  const timeStamp = (message) => {
    //console.log(dayjs(new Date(message.createdAt)).format('DD-MM-YYYY'));
    //if (message.createdAt && dayjs(new Date()).format('DD-MM-YYYY') === dayjs(message.createdAt).format('DD-MM-YYYY')) {
    //  return dayjs(message.createdAt).format('HH:mm:ss')
    //}
    var fecha=new Date(...getParsedDate(message.createdAt));

    console.log(fecha);
    return message.createdAt;
  }

  return (
    <Container>
      <Content style={{
        position: 'relative',
      }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{
          flex: 1,
        }}
        >
          <FlatList
            data={conversations}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={renderSeparator}
            renderItem={(conversation) => {
              let { item } = conversation;
              let { id, username } = item;
              return (
                <Pressable
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    paddingVertical: 8,
                  }}
                  onPress={() => navigation.navigate('Chat', {
                    screen: 'Chat',
                    params: { partnerId: id, partnerImage: partnerImages[username], partnerName: username, messagesFirst: messages[id] },
                  })}
                >
                  <View style={{ flex: 2, marginLeft: 20 }}>
                    <Image
                      source={{
                        uri: partnerImages[username],
                      }}
                      style={{
                        width: 40,
                        height: 40,
                      }}
                    />
                  </View>
                  <View style={{ flex: 8, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, }}>{username}</Text>
                    <Text style={{ fontSize: 14, color: 'grey' }} numberOfLines={1}>{messages && messages[id] && messages[id][0] && messages[id][0].text || "Empieza la convseración"}</Text>
                  </View>
                  <View style={{ marginRight: 20 }}>
                    <Text style={{ fontSize: 14, color: 'grey' }}>{messages && messages[id] && messages[id][0] && timeStamp(messages[id][0])}</Text>
                  </View>
                </Pressable>
              )
            }}
          />
        </View>
      </Content>
    </Container >
  )
}