import React from 'react';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { View } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import MapContainer from '../components/Map/MapContainer';
import ModifyUserInfoScreen from '../components/User/Conf/ModifyUserInfoScreen';
import HelpScreen from '../components/Help/HelpScreen';
import ScreenWithHeader from '../components/ScreenWithHeader';
import PodcastScreen from '../components/Podcast/PodcastScreen';
import GetProScreen from '../components/GetPro/GetProScreen';
import HelpActionScreen from '../components/Help/HelpActionScreen';
import ChatScreen from '../components/Chat/Chat';
import ConversationsScreen from '../components/Chat/Conversations';
import HomeScreen from '../components/HomeScreen';
import ConfiguracionUsuario from '../components/User/Conf/ConfiguracionUsuario';
import { logOut } from '../actions';
import ProfileCard from '../components/elements/users/ProfileCard';
import { NamiquiDrawerItem, NamiquiDrawerItemLink } from '../components/styledComponents';
import menuIconMap from '../assets/icons/Menu_Icon_Map.png';
import menuIconConfig from '../assets/icons/Menu_Icon_Config.png';
import menuIconHelp from '../assets/icons/Menu_Icon_Help.png';
import menuIconPodcast from '../assets/icons/Menu_Icon_Podcast.png';
import menuIconEndSession from '../assets/icons/Menu_Icon_End_Session.png';
import menuIconCorreo from '../assets/icons/Icon_correo.png';
import menuIconQuestion from '../assets/icons/Icon_Question.png';



const Drawer = createDrawerNavigator();

function LogOutDrawerContent(props) {
  const { navigation } = props;
  const user = useSelector((state) => state.userReducers.user);
  const notification = useSelector((state) => state.userReducers.notification);
  const dispatch = useDispatch();
  return (
    <View style={{ flex: 1, position: 'relative', paddingTop: 0 }} {...props}>

      <ProfileCard user={user} navigation={navigation} />
      <NamiquiDrawerItem navigation={navigation} label="Mapa Delictivo" icon={menuIconMap} />
      <NamiquiDrawerItem navigation={navigation} label="Config Ayúdame" screen="Ayuda" icon={menuIconHelp} />
      <NamiquiDrawerItem navigation={navigation} label="Configuración" icon={menuIconConfig} />
      <NamiquiDrawerItem navigation={navigation} label="Podcast" icon={menuIconPodcast} />
      <NamiquiDrawerItem navigation={navigation} label="Vuélvete PRO" icon={menuIconHelp} />

      <NamiquiDrawerItem navigation={navigation} label="Chat Namiusers" icon={notification?.newNotification ? menuIconHelp : menuIconCorreo} />
      <NamiquiDrawerItemLink link="http://wa.link/2t1a0h" label="Contactanos" icon={menuIconQuestion} />
     


      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#FC2241', '#D02238']}
          style={{
            position: 'absolute',
            height: 1,
            top: 1,
            left: 0,
            right: 0,
          }}
        />
        <NamiquiDrawerItem
          icon={menuIconEndSession}
          label="Cerrar Sesión"
          style={{
            backgroundColor: '#1E1E1F',
            flex: 1,
          }}
          labelStyle={{
            color: '#fff',
            fontFamily: 'Kollektif-Bold',
            fontSize: 20,
          }}
          onPress={() => dispatch(logOut())}
        />
      </View>
    </View>
  );
}

export default function AuthorizedDrawer(props) {
  const { initialRoute } = props
  console.log('AuthDrawer initialRoute ', initialRoute);
  return (
    <Drawer.Navigator
      initialRouteName={initialRoute || "Home"}
      drawerContent={(props) => <LogOutDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: '#1E1E1F',
        width: 325,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Mapa Delictivo" component={MapContainer} />
      <Drawer.Screen name="Modificar Mis Datos">
        {(props) => <ScreenWithHeader screenComponent={ModifyUserInfoScreen} screenName="Modificar Mis Datos" />}
      </Drawer.Screen>
      <Drawer.Screen name="Ayuda">
        {(props) => <ScreenWithHeader screenComponent={HelpScreen} screenName="Ayuda" />}
      </Drawer.Screen>
      <Drawer.Screen name="Podcast">
        {(props) => <ScreenWithHeader screenComponent={PodcastScreen} screenName="Podcast" />}
      </Drawer.Screen>
      <Drawer.Screen name="Vuélvete PRO">
        {(props) => <ScreenWithHeader screenComponent={GetProScreen} screenName="Vuélvete PRO" />}
      </Drawer.Screen>
      <Drawer.Screen name="Chat">
        {(props) => <ScreenWithHeader screenComponent={ChatScreen} screenName="Chat" />}
      </Drawer.Screen>
      <Drawer.Screen name="Chat Namiusers">
        {(props) => <ScreenWithHeader screenComponent={ConversationsScreen} screenName="Chat Namiusers" />}
      </Drawer.Screen>
      <Drawer.Screen name="Pedir Ayuda" component={HelpActionScreen} />
      <Drawer.Screen name="Configuración">
        {(props) => <ScreenWithHeader screenComponent={ConfiguracionUsuario} screenName="Configuración" />}
      </Drawer.Screen>


    </Drawer.Navigator>
  );
}