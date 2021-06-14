import React, { useState, useCallback, useEffect } from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { GiftedChat, InputToolbar, Composer, Send, SystemMessage, Message, Bubble } from 'react-native-gifted-chat'
import { colors } from '../../style';
import 'dayjs/locale/es';
import { getMessages, updateMessages } from '../../api/chat';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Content, Text, View } from 'native-base';
import { NamiquiTitle } from '../styledComponents';
import { ActivityIndicator } from 'react-native';
import { getUserById, getUserByUsername } from '../../api/users';
import { storeNotification } from '../../actions';

export default function ChatScreen({ route, navigation }) {
  const { params = { partnerId: undefined, partnerImage: undefined, partnerName: undefined, messagesFirst: undefined } } = route;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { partnerId, partnerImage, partnerName, messagesFirst } = params;
  const [currentPartnerId, setCurrentPartnerId] = useState(partnerId);
  const [currentPartnerImage, setCurrentPartnerImage] = useState(partnerImage);
  const [currentPartnerName, setCurrentPartnerName] = useState(partnerName);
  const [messages, setMessages] = useState(undefined);
  useEffect(() => setMessages(messagesFirst), [messagesFirst]);
  const token = useSelector((state) => state.userReducers.JWT);
  const user = useSelector((state) => state.userReducers.user);
  const notification = useSelector((state) => state.userReducers.notification);

  const userId = user.id;
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [page, setPage] = useState(1);
  useFocusEffect(useCallback(() => setPage(1), [])
  );

  useEffect(() => {
    if (isFocused && notification?.newNotification && parseInt(notification.data.userId, 10) === parseInt(currentPartnerId, 10)) {
      console.log('setting new messages');
      let newMessages = [{
        _id: notification.data.id,
        text: notification.notification.body,
        createdAt: notification.data.createdAt,
        user: {
          _id: notification.data.userId,
          name: currentPartnerName,
          avatar: currentPartnerImage,
        },
      }]
      setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
      let readNotification = { ...notification };
      readNotification.newNotification = false;
      dispatch(storeNotification(readNotification));
    } else if (isFocused && !notification?.hasOwnProperty('newNotification')) {
      setLoading(true);
      getMessages({ token, userId, partnerId: notification.data.userId, requestedPage: page })
        .then((response) => {
          console.log('Chat No Data useEffect getMessage response', response);
          let newMessages = [];
          if (response.data) {
            
            response.data.messages.forEach((message) => {
              var fecha=new Date(...getParsedDate(message.createdAt));
              newMessages.push({

                _id: message.id,
                text: message.text,
                createdAt: fecha,//message.createdAt,
                user: {
                  _id: message.userId,
                  name: currentPartnerName,
                  avatar: currentPartnerImage,
                },
              });
              setMessages(newMessages);
              let readNotification = { ...notification };
              readNotification.newNotification = false;
              dispatch(storeNotification(readNotification));
            });
          }
          setLoading(false)
        })
    }
  }, [notification])

  useEffect(() => {
    if (!partnerId) {
      console.log('Chat - no id sent')
      setCurrentPartnerId(notification.data.userId);
      setCurrentPartnerName(undefined);
      setCurrentPartnerImage(undefined);
      setMessages(undefined);
    }
    else {
      setCurrentPartnerId(partnerId);
      setCurrentPartnerName(partnerName);
      setCurrentPartnerImage(partnerImage);
      setMessages(messagesFirst);
    }
  }, [partnerId]);

  useEffect(() => {
    console.log('partner ID change', { currentpartnerId: currentPartnerId, currentPartnerImage, currentpartnerName: currentPartnerName, messages })
    if (currentPartnerId && (!currentPartnerImage || !currentPartnerName || !messages)) {
      setLoading(true);
      console.log('Chat - entered useEffect for No Data')
      getUserById({ token, id: currentPartnerId })
        .then((response) => {
          console.log('Chat getUserById', response);
          setCurrentPartnerImage(response.user_image_url);
          setCurrentPartnerName(response.username);
          return response;
        })
        .then((userResponse) => {
          getMessages({ token, userId, partnerId: currentPartnerId, requestedPage: page })
            .then((response) => {
              console.log('Chat No Data useEffect getMessage response', response);
              
              let newMessages = [];
              if (response.data) {
                response.data.messages.forEach((message) => {
                  var fecha=new Date(...getParsedDate(message.createdAt));
                  newMessages.push({
                    _id: message.id,
                    text: message.text,
                    createdAt:fecha,// message.createdAt,
                    user: {
                      _id: message.userId,
                      name: userResponse.username,
                      avatar: userResponse.user_image_url,
                    },
                  });
                  setMessages(newMessages);
                });
              }
              setLoading(false)
            })
        })
        .catch((error) => {
          console.log('loading Chat error', error);
          setLoading(false);
        })
    }
  }, [currentPartnerId])



  const onSend = useCallback((messages = []) => {
    console.log('sending', messages[0].text) 
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    updateMessages({ token, userId, partnerId, text: messages[0].text });
  }, [currentPartnerId])
  function getParsedDate(date){
    date = String(date).split(' ');
    var days = String(date[0]).split('-');
    var hours = String(date[1]).split(':');
    return [parseInt(days[0]), parseInt(days[1])-1, parseInt(days[2]), parseInt(hours[0]), parseInt(hours[1]), parseInt(hours[2])];
  }
  function loadEarlier() {
    console.log('loading earlier messages');
    setLoadingOlder(true);
    getMessages({ token, userId, partnerId: currentPartnerId, requestedPage: page + 1 })
      .then((response) => {
        let newMessages = [];
        if (response.data) {
        
          response.data.messages.forEach((message) => {
            var fecha=new Date(...getParsedDate(message.createdAt));
            console.log('current image -', currentPartnerImage)
            newMessages.push({
              _id: message.id,
              text: message.text,
              createdAt: fecha,//message.createdAt,
              user: {
                _id: message.userId,
                name: currentPartnerName,
                avatar: currentPartnerImage,
              },
            });
          })
          setMessages((previousMessages) => [...previousMessages, ...newMessages]);
          setPage((page) => page += 1);
        }
      })
      .then((res) => setLoadingOlder(false))
  }
  if (loading) {
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <ActivityIndicator size={50} color={colors.COLOR_SELECTED} />
      </View>
    )
  } else {
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
            <NamiquiTitle text={currentPartnerName} />
            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              loadEarlier
              onLoadEarlier={loadEarlier}
              isLoadingEarlier={loadingOlder}
              user={{
                _id: userId,
              }}
              locale='es'
              listViewProps={{
                style: {
                  backgroundColor: colors.COLOR_BACKGROUND_GRAY_STRONG,
                },
              }}
              renderBubble={
                props => (<Bubble {...props} wrapperStyle={{
                  right: {
                    backgroundColor: colors.COLOR_TEXT_BLACK_DEFAULT
                  },
                  left: {
                    backgroundColor: 'white'
                  }
                }} />)
              }
              renderInputToolbar={
                props =>
                  (<InputToolbar {...props} containerStyle={{ backgroundColor: colors.COLOR_BACKGROUND_GRAY }} renderComposer={props1 => (<Composer {...props1} textInputStyle={{ color: "white" }} />)} />)
              }
              renderSend={
                props => (<Send {...props} textStyle={{ color: colors.COLOR_DANGER }} />)
              }
            />
          </View>
        </Content>
      </Container>
    )
  }
}