/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  TextInput, View, Image, Modal, ActivityIndicator, Linking, ScrollView
} from 'react-native';
import { Card, Button, Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { DrawerItem } from '@react-navigation/drawer';
import styles, { colors } from '../style';
import logo from '../assets/icons/Logo_icon.png';

function NamiquiLogo(props) {
  const { style } = props;
  return (
    <View style={{
      display: 'flex', alignItems: 'center', width: '100%', marginTop: 15,
    }}
    >
      <Image
        source={logo}
        style={{
          height: 90,
          resizeMode: 'contain',
          marginLeft: 0,
          marginRight: 0,
          marginTop: 0,
          marginBottom: 0,
          ...style,
        }}
      />
    </View>
  );
}

function NamiquiInput(props) {
  const { iconComponent, bordered, multiline, viewStyle } = props;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginVertical: 10,
        borderColor: bordered ? '#000' : 'transparent',
        borderWidth: 1,
        borderStyle: 'solid',
        minHeight: 50,
        ...viewStyle
      }}
    >
      <TextInput multiline={multiline} numberOfLines={multiline ? 4 : undefined} textAlignVertical={multiline ? 'top' : undefined} style={styles.TextInput} {...props} placeholderTextColor="#666" />
      {iconComponent || null}
    </View>
  );
}

function NamiquiInputIcon(props) {
  const { source } = props;
  return (
    <Image
      source={source}
      style={{
        alignSelf: 'center', height: 25, width: 25, marginRight: 15,
      }}
    />
  );
}

function NamiquiCard(props) {
  const { style } = props;
  return (
    <Card>
      <LinearGradient
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          width: '100%',
          height: '100%',
          borderRadius: 25,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          ...style,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['#2E3138', '#3D4148']}
        {...props}
      />
    </Card>
  );
}

function NamiquiButton(props) {
  const {
    style, icon, text, textStyle, onPress, dark, loading, disabled
  } = props;
  let buttonText;
  if (typeof text === 'string') {
    buttonText = <Text style={{ fontSize: 20, textAlign: 'center', ...textStyle }}>{text}</Text>;
  } else {
    buttonText = text;
  }

  if (!loading) {
    return (
      <Button
        onPress={onPress}
        style={{
          position: 'relative',
          minWidth: (style && style.width) ? style.width : 280,
          alignSelf: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          ...style,
        }}
        disabled={loading || disabled}
      >
        <LinearGradient
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 25,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={dark ? ['#302F2F', '#514C4C'] : ['#FC2241', '#D02238']}
          pointerEvents="none"
        >
          {icon ? (
            <View style={{
              height: '100%', width: 40, position: 'absolute', left: 10,
            }}
            >
              {icon}
            </View>
          )
            : null}
          {buttonText}
        </LinearGradient>
      </Button>
    );
  }

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <ActivityIndicator size={50} color={colors.COLOR_SELECTED} />
    </View>
  );
}

function NamiquiTitle(props) {
  const { text, subtext, style } = props;
  return (
    <Text
      style={{
        fontSize: 22, color: '#fff', marginLeft: 15, marginBottom: 15, marginTop: 15, ...style,
      }}
    >
      {text}
      {subtext}
    </Text>
  );
}

function NamiquiAlert(props) {
  const {
    image, title, message, closeModal, visible, onDismiss, buttonText, cancelable, cancelButtonText
  } = props;

  function dismissModal() {
    closeModal();
    if (onDismiss) {
      onDismiss();
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      presentationStyle="overFullScreen"
    >
      <View
        style={{
          width: '90%',
          borderRadius: 25,
          backgroundColor: '#fff',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 'auto',
          marginBottom: 'auto',
          position: 'relative',
          padding: 15,
          paddingTop: 45,
        }}
      >
        {
          image ? (
            <View
              style={{
                alignItems: 'center', height: 60, marginVertical: 15, padding: 0,
              }}
            >
              <Image
                source={image}
                style={{
                  height: '100%',
                  resizeMode: 'contain',
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 0,
                  marginBottom: 0,
                }}
              />
            </View>
          )
            : null
        }
        {
          title ? (
            <Text style={{
              color: '#E72945', fontSize: 32, textAlign: 'center', fontWeight: 'bold', marginVertical: 15,
            }}
            >
              {title}
            </Text>
          )
            : null
        }
        {
          message ? (
            <ScrollView style={{ maxHeight: '50%' }}>
              <Text style={{
                color: '#000', fontSize: 24, textAlign: 'center', marginVertical: 15,
              }}
              >
                {message}
              </Text>
            </ScrollView>
          )
            : null
        }
        <NamiquiButton
          text={buttonText || 'Entendido'}
          onPress={dismissModal}
          style={{
            marginVertical: 15,
          }}
        />
        {cancelable
          ? (
            <NamiquiButton
              text={cancelButtonText || 'Cancelar'}
              onPress={closeModal}
              style={{
                marginVertical: 15,
              }}
            />
          )
          : null}
      </View>
    </Modal>
  );
}

function NamiquiDrawerItem(props) {
  const {
    navigation, label, icon, screen, onPress,
  } = props;
  return (
    <View style={{
      width: '90%', height: 50, display: 'flex', flexDirection: 'row',
    }}
    >
      <DrawerItem
        icon={({ focused, color, size }) => (
          <Image
            source={icon}
            style={{
              alignSelf: 'center', height: 35, width: 35, marginLeft: 0,
            }}
          />
        )}
        label={label}
        style={{ backgroundColor: '#1E1E1F', flex: 1 }}
        labelStyle={{ color: '#fff', fontFamily: 'Kollektif-Bold', fontSize: 20 }}
        onPress={() => (onPress ? onPress() : navigation.navigate(screen || label))}
      />
    </View>
  );
}


function NamiquiDrawerItemLink(props) {
  const {
    link, label, icon, screen, onPress,
  } = props;
  return (
    <View style={{
      width: '100%', height: 50, display: 'flex', flexDirection: 'row',
    }}
    >
      <DrawerItem
        icon={({ focused, color, size }) => (
          <Image
            source={icon}
            style={{
              alignSelf: 'center', height: 35, width: 35, marginLeft: 0,
            }}
          />
        )}
        label={label}
        style={{ backgroundColor: '#1E1E1F', flex: 1 }}
        labelStyle={{ color: '#fff', fontFamily: 'Kollektif-Bold', fontSize: 20 }}
        onPress={() => (onPress ? onPress() : Linking.openURL(link))}
      />
    </View>
  );
}

function NamiquiLoadingOverlay(props) {
  const { loading } = props;
  return (
    <View style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.72)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ActivityIndicator size={50} color={colors.COLOR_SELECTED} />
    </View>
  )
}

export {
  NamiquiInput,
  NamiquiCard,
  NamiquiButton,
  NamiquiLogo,
  NamiquiTitle,
  NamiquiAlert,
  NamiquiInputIcon,
  NamiquiDrawerItem,
  NamiquiDrawerItemLink,
  NamiquiLoadingOverlay
};
