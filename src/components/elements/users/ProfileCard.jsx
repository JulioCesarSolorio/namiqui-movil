import { View } from 'native-base';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { NamiquiButton } from '../../styledComponents';
import NamiUserLabel from './NamiUserLabel';

export default function ProfileCard(props) {
  const { user, navigation } = props;
  return (
    <View style={{
      width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: 20, marginBottom: 30,
    }}
    >
      <View style={{
        alignItems: 'flex-start',
      }}
      >
        <NamiUserLabel
          user={user}
          imgSize={60}
          userRol={user && user.roles && user.roles[0] && user.roles[0].name === 'USER_FREE' ? 'Namiqui Free' : 'Pruebas'}
        />
      </View>
      <NamiquiButton
        style={{
          height: 25,
          marginBottom: 20,
          alignSelf: 'flex-start',
        }}
        text="Editar perfil"
        textStyle={{ fontSize: 12 }}
        onPress={() => navigation.navigate('Modificar Mis Datos')}
      />
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#FC2241', '#D02238']}
        style={{
          position: 'absolute',
          height: 1,
          bottom: 1,
          left: 0,
          right: 0,
        }}
      />
    </View>
  );
}
