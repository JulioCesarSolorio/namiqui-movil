import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import backIcon from '../assets/icons/Icon_arrow_left.png';
import drawerIcon from '../assets/icons/Icon_Menu.png';

export default function NamiquiNavHeader({
  scene, previous, navigation, authorized,
}) {
  const { options } = scene.descriptor;
  const title = options.headerTitle !== undefined
    ? options.headerTitle
    : options.title !== undefined
      ? options.title
      : scene.route.name;

  function MyBackButton(props) {
    const { goBack } = props;
    return (
      <Pressable style={{ height: 20, position: 'absolute', left: 20 }} onPress={goBack}>
        <Image source={backIcon} style={{ height: 20, resizeMode: 'contain' }} />
      </Pressable>
    );
  }

  function DrawerButton(props) {
    const { navigation } = props;
    const { toggleDrawer } = navigation;
    return (
      <Pressable style={{ height: 20, position: 'absolute', left: 20 }} onPress={toggleDrawer}>
        <Image source={drawerIcon} style={{ height: 28, width: 28, resizeMode: 'contain' }} />
      </Pressable>
    );
  }

  return (
    <View
      style={{
        position: 'relative',
        backgroundColor: '#1E1E1F',
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 25,
      }}
    >
      {authorized
        ? <DrawerButton navigation={navigation} />
        : <MyBackButton goBack={navigation.goBack} />}

      <Text style={{ fontSize: 24, marginLeft: 'auto', marginRight: 'auto' }}>{title}</Text>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#FC2241', '#D02238']}
        style={{
          ...options.headerStyle,
          position: 'absolute',
          height: 1,
          bottom: 1,
          left: 20,
          right: 20,
        }}
      />
    </View>
  );
}
