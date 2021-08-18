import {
  Container, Content, Text, Button,
} from 'native-base';
import React, { useState } from 'react';
import {
  View, Image, Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'react-moment';
import { storeNotification } from '../../actions';
import { NamiquiAlert, NamiquiButton } from '../styledComponents';
import NamiUserLabel from '../elements/users/NamiUserLabel';
import logoIcon from '../../assets/icons/Logo_icon.png';
import { colors } from '../../style';
import failureIcon from '../../assets/icons/alerta_2.png';
import 'moment/locale/es';

export default function RecievePushAlertScreen({ navigation }) {
  const pushNotification = useSelector((state) => state.userReducers.notification);
  const user = useSelector((state) => state.userReducers.user);
  console.log('recievePush notification', pushNotification);
  const { data, sentTime } = pushNotification;
  const lat = parseFloat(data.latitude);
  const lng = parseFloat(data.longitude);
  console.log('RecievePush lat lng', lat, lng);
  const { name, address, username } = data;
  const userImage = parseInt(data.user_image, 10);
  const dispatch = useDispatch();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Alerta');
  const [alertImage, setAlertImage] = useState(failureIcon);
  const [alertText, setAlertText] = useState('Una alerta genérica');

  function closeModal() {
    setAlertVisible(false);
  }

  function handleCloseAlert() {
    setAlertVisible(true);
    setAlertTitle('¿Estás seguro?');
    setAlertText('Una vez que cierres esta notificación, no lo podras abrir de nuevo.');
    setAlertImage(failureIcon);
  }
  return (
    <Container>
      <View style={{
        padding: 24,
        borderBottomColor: colors.COLOR_SELECTED,
        borderBottomWidth: 1,
      }}
      >
        <Text style={{
          textAlign: 'center',
          fontSize: 24,
        }}
        >
          Necesitan de tu ayuda
        </Text>
      </View>
      <Content>
        <View style={{
          width: '100%', display: 'flex', alignItems: 'center', marginBottom: 10,
        }}
        >

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#FC2241', '#D02238']}
            style={{
              position: 'absolute',
              height: 1,
              bottom: 1,
              left: 20,
              right: 20,
            }}
          />
        </View>
        <Text style={{ alignSelf: 'center', fontSize: 24, marginBottom: 10 }}>¡Ayudame!</Text>
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
        >
          <NamiUserLabel
            user={user}
            imgSize={60}
          />
        </View>
        <MapView
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0150,
            longitudeDelta: 0.0150,
          }}
          zoomEnabled
          zoomTapEnabled
          provider={PROVIDER_GOOGLE}
          rotateEnabled
          style={{
            height: 200,
            marginHorizontal: -20,
          }}
        >
          <Marker
            coordinate={{
              latitude: lat,
              longitude: lng,
            }}
            title={username}
            description={`¡${username} necesita de tu ayuda!`}
          >
            <View>
              <Image
                source={logoIcon}
                style={{
                  height: 30,
                  width: 30,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </Marker>
        </MapView>

        <View style={{
          padding: 20,
          marginBottom: -20,
        }}
        >
          <Button
            onPress={() => {
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
            }}
            block
            info
          >
            <Text>Visualiza en Google Maps</Text>
          </Button>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <NamiUserLabel
            user={{
              name,
              username,
              userImage,
              user_image_url: data.user_image_url,
            }}
            imgSize={60}
          />
        </View>
        <View style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
          <View style={{
            paddingHorizontal: 20,
          }}
          >
            <Text>{address && 'Estoy en:'}</Text>
            <Text>{address}</Text>
            <View style={{
              marginTop: 10,
            }}
            >
              <Text>Fecha y Hora:</Text>
              <Moment locale="es" format="dddd, D MMM YYYY - h:mm A" element={Text}>
                { sentTime }
              </Moment>
            </View>
          </View>
        </View>
      </Content>
      <View style={{
        padding: 30,
      }}
      >
        <NamiquiButton text="Alerta atendida" onPress={handleCloseAlert} />
      </View>
      <NamiquiAlert
        visible={alertVisible}
        message={alertText}
        image={alertImage}
        title={alertTitle}
        closeModal={closeModal}
        onDismiss={() => dispatch(storeNotification(undefined))}
        cancelable
      />
    </Container>
  );
}
