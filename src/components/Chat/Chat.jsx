import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar, Composer, Send, SystemMessage, Message, Bubble } from 'react-native-gifted-chat'
import { colors } from '../../style';
import 'dayjs/locale/es';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
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
  )
}