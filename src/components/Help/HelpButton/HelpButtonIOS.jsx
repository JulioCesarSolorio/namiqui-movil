import React from 'react';
import { Image, View, Dimensions, Platform } from 'react-native';
import Draggable from 'react-native-draggable';
import bubbleIcon from '../../../assets/icons/Logo_icon.png';

export default function HelpButtonIOS({ navigation, showing }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  if (Platform.OS === 'ios' && showing) {
    return (
      <Draggable
        renderSize={56}
        renderColor="#000"
        renderText=""
        isCircle
        onShortPressRelease={() => navigation.navigate('Pedir Ayuda')}
        minX={0}
        minY={0}
        maxX={windowWidth}
        maxY={windowHeight - 75}
      // onDragRelease={handleDrag}
      >
        <View
          style={{
            height: 65,
            width: 65,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image resizeMode="contain" source={bubbleIcon} style={{ height: '80%', width: '80%' }} />
        </View>
      </Draggable>

    );
  }
  return <View />;
}
