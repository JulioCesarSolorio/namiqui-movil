import React from 'react';
import { Platform, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
//import HelpButtonAndroid from './HelpButtonAndroid';
import { colors } from '../../../style';
import { storeShowiOSButton } from '../../../actions';
import { NamiquiButton } from '../../styledComponents';

export default function HelpButton(props) {
  const {
    showingHelpButton, setShowingHelpButton, navigation, dispatch, showingIOSButton,
  } = props;
  /*if (Platform.OS === 'android') {
    return (
      <HelpButtonAndroid
        navigation={navigation}
        showingHelpButton={showingHelpButton}
        setShowingHelpButton={setShowingHelpButton}
      />
    );
  }*/
  if (Platform.OS === 'ios') {
    return (
      <View style={{
        flexDirection: 'row',
        flex: 12,
      }}
      >
        <View style={{
          flex: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Icon
            name="exclamation-triangle"
            color={colors.COLOR_DANGER}
            size={30}
          />
        </View>
        <View style={{
          flex: 10,
        }}
        >
          <NamiquiButton
            onPress={() => dispatch(storeShowiOSButton(!showingIOSButton))}
            style={{ width: '100%', minWidth: 220 }}
            textStyle={{ fontSize: 16 }}
            text={showingIOSButton ? 'Esconder Boton Ayudame' : 'Mostrar Boton Ayudame'}
          />
        </View>
      </View>
    );
  }
  return (<View />);
}
