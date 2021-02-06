import { Container, Content, Text } from 'native-base';
import React, { useCallback, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  StyleSheet, View, Dimensions, Alert, ActivityIndicator, BackHandler, TouchableOpacity,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { colors } from '../../style';
import MapCrimesLayer from '../elements/map/layers/MapCrimesLayer';
import MapCrimeAreaLayer from '../elements/map/layers/MapCrimeAreaLayer';
import ModalCrimesForm from '../elements/map/ModalCrimesForm';
import MapCrimeAreaDetailScreen from './MapCrimeAreaDetailScreen';
import NamiquiNavHeader from '../NamiquiNavHeader';
import { NamiquiAlert } from '../styledComponents';
import failureIcon from '../../assets/icons/alerta_2.png';
import HelpButtonIOS from '../Help/HelpButton/HelpButtonIOS';
import Gps from '../../gps/Gps';

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height - 100,
    width: Dimensions.get('window').width,
  },
});

const Stack = createStackNavigator();

let gpsInterval;
let MapComponent;
let initialRegion;
let isMapInitialized = false;
let existGpsLoop = false;

const DELTA_LATITUDE = 0.0922;
const DELTA_LONGITUDE = 0.0421;
const REFRESH_LOOP_TIME_WITHOUT_GPS = 10;

// =============== INIT MAP =======================
function setMapInitialRegion() {
  Gps.getUserLastPosition((position) => {
    if (position) {
      initialRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: DELTA_LATITUDE,
        longitudeDelta: DELTA_LONGITUDE,
      };
    }
  });
}

setMapInitialRegion();

function MapContainerView({ navigation }) {
  const showingIOSButton = useSelector((state) => state.userReducers.showIOSButton);
  const [showModalCrimeListFilters, setShowModalCrimeList] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Alerta');
  const [alertImage, setAlertImage] = useState(failureIcon);
  const [alertText, setAlertText] = useState('Una alerta genérica');
  const [logMessage, setLogMessage] = useState('');
  const [logLoading, setLogLoading] = useState(false);
  const [userLocation, setUserLocation] = useState({});
  const [crimeMap, setCrimeMap] = useState({
    data: [],
    showCrimes: false,
    showHeatmap: false,
    heatmap_point_size: 0,
  });
  const [repaintPixel, setRepaintPixel] = useState(0);

  // ==================== INIT =====================
  function deleteGpsRefreshInterval() {
    if (existGpsLoop) {
      clearInterval(gpsInterval);
      console.log('DELETE LOOP: ', gpsInterval);
      existGpsLoop = false;
    }
  }

  function handleBackButtonClick() {
    Alert.alert(
      'Cerrar la aplicación',
      '¿Estás seguro que deseas salir de la aplicación? ', [{
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Salir',
        onPress: () => BackHandler.exitApp(),
      }],
      {
        cancelable: false,
      },
    );
    return true;
  }

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () => {
        deleteGpsRefreshInterval();
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
      };
    }, []),
  );

  // ================== LOG =====================
  function log(msj, loading) {
    setLogMessage(msj);
    setLogLoading(loading);
    console.log(msj);
  }

  // ======== MODAL DE LOS FILTROS ============

  function closeModal() {
    setAlertVisible(false);
  }

  // ================== LOOP ===================

  function initMap() {
    // Se llama updateMapStyle para repintar el mapa para poder mostrar el logo de google
    // en el lugar correcto. La libreraria cuenta con un fallo y este es un workaround
    function updateMapStyle() {
      setRepaintPixel(1);
    }

    function initGpsRefreshInterval(seconds) {
      function updateUserLocation() {
        log('Obteniendo Ubicación', true);
        Gps.getGPSPosition(
          (position) => {
            // se obtiene ubicacion GPS
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: DELTA_LATITUDE,
              longitudeDelta: DELTA_LONGITUDE,
            };
            if (isMapInitialized) {
              MapComponent.animateToRegion(newLocation, 3000);
            }
            log('', false);
            deleteGpsRefreshInterval();
            setUserLocation(newLocation);
          },
          (error) => {
            log(error, true);
          },
        );
      }

      if (!existGpsLoop) {
        gpsInterval = setInterval(() => {
          updateUserLocation();
        }, 1000);
        console.log('NUEVO Loop de resfresh del mapa: ', seconds, gpsInterval);
        existGpsLoop = true;
      }
    }

    updateMapStyle();
    isMapInitialized = true;
    Gps.getUserLastPosition((position) => {
      if (position) {
        MapComponent.animateToRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: DELTA_LATITUDE,
          longitudeDelta: DELTA_LONGITUDE,
        }, 100);
      }
    });
    Gps.initWatchPosition();
    initGpsRefreshInterval(REFRESH_LOOP_TIME_WITHOUT_GPS);
  }

  function centerMapInUserPosition() {
    log('Obteniendo Ubicación', true);

    Gps.getGPSPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: DELTA_LATITUDE,
          longitudeDelta: DELTA_LONGITUDE,
        };

        if (isMapInitialized) {
          MapComponent.animateToRegion(newLocation, 3000);
        }
        setUserLocation(newLocation);
        log('', false);
      },
      (error) => {
        setAlertVisible(true);
        setAlertTitle('Sin Ubicación GPS');
        setAlertText(error);
        setAlertImage(failureIcon);
        log('', false);
      },
    );
  }

  return (
    <Container>
      <Content style={{ position: 'relative' }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{
          flex: 1,
          paddingTop: repaintPixel,
        }}
        >
          <MapView
            // use next line for FollowMe feature
            // followsUserLocation={true}
            ref={(mapView) => { MapComponent = mapView; }}
            showsUserLocation={Boolean(userLocation.latitude)}
            zoomEnabled={false}
            rotateEnabled
            zoomTapEnabled={false}
            zoomControlEnabled={false}
            scrollEnabled
            showsMyLocationButton={false}
            loadingEnabled
            style={styles.map}
            initialRegion={initialRegion}
            provider={PROVIDER_GOOGLE}
            mapPadding={{
              top: 0,
              right: 0,
              bottom: 80,
              left: 0,
            }}
            onMapReady={() => {
              initMap();
            }}
          >
            <MapCrimesLayer crimeMap={crimeMap} />
            <MapCrimeAreaLayer
              userLocation={userLocation}
              navigation={navigation}
            />
          </MapView>
          {(logMessage !== '')

            && (
              <View style={{
                position: 'absolute',
                top: 22,
                right: 10,
                backgroundColor: colors.COLOR_BACKGROUND_GRAY,
                padding: 4,
                paddingHorizontal: 14,
                borderRadius: 8,
                flexDirection: 'row',
              }}
              >
                {(logLoading)
                  && (
                    <View style={{
                      marginRight: 8,
                    }}
                    >
                      <ActivityIndicator
                        color={colors.COLOR_SELECTED}
                        size={18}
                      />
                    </View>
                  )}
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                >
                  <Text style={{ fontSize: 10 }}>{logMessage}</Text>
                </View>
              </View>
            )}
        </View>
        <View style={{
          position: 'absolute',
          top: 20,
          left: 20,
        }}
        >
          <TouchableOpacity onPress={() => {
            centerMapInUserPosition();
          }}
          >
            <View style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              backgroundColor: colors.COLOR_BACKGROUND_GRAY,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              <Icon
                name="crosshairs"
                color={colors.COLOR_SELECTED}
                size={20}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{
          backgroundColor: colors.COLOR_BACKGROUND_GRAY_STRONG,
          padding: 20,
          borderTopEndRadius: 30,
          borderTopStartRadius: 30,
          borderTopColor: colors.COLOR_BORDER,
          borderTopWidth: 1,
          color: '#fff',
          position: 'absolute',
          bottom: 0,
          width: Dimensions.get('window').width,
          height: 100,
        }}
        >
          <TouchableOpacity onPress={() => {
            setShowModalCrimeList(true);
          }}
          >
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              <View style={{
                backgroundColor: colors.COLOR_SELECTED,
                width: 25,
                height: 5,
                borderRadius: 2,
                marginBottom: 10,
              }}
              />
              <Text style={{
                textAlign: 'center',
                fontSize: 22,
              }}
              >
                Listado de delitos
              </Text>
            </View>
            <Text style={{
              textAlign: 'center',
              fontSize: 14,
            }}
            >
              Elige tu visualización
            </Text>
          </TouchableOpacity>
        </View>
      </Content>
      <ModalCrimesForm
        modalOpen={showModalCrimeListFilters}
        closeModal={() => setShowModalCrimeList(false)}
        navigation={navigation}
        onUpdate={(mapData, error) => {
          setShowModalCrimeList(false);

          if (!error) {
            setCrimeMap(mapData);
          } else {
            setAlertVisible(true);
            setAlertTitle('Error');
            setAlertText(error);
            setAlertImage(failureIcon);
          }
        }}
      />
      <NamiquiAlert
        visible={alertVisible}
        message={alertText}
        image={alertImage}
        title={alertTitle}
        closeModal={closeModal}
      />
      <HelpButtonIOS navigation={navigation} showing={showingIOSButton} />
    </Container>
  );
}

export default function MapContainer() {
  return (
    <Stack.Navigator
      headerMode="screen"
      headerStyle={{ height: 80 }}
      initialRouteName="Mapa Delictivo"
      screenOptions={{
        header: ({ scene, previous, navigation }) => <NamiquiNavHeader authorized scene={scene} previous={previous} navigation={navigation} />,
      }}
    >
      <Stack.Screen name="Mapa Delictivo" component={MapContainerView} />
      <Stack.Screen name="Detalle Del Área" component={MapCrimeAreaDetailScreen} />
    </Stack.Navigator>
  );
}
