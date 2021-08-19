import { Text } from 'native-base';
import React, { useState } from 'react';
import {
  StyleSheet, View, Dimensions,  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors } from '../../style';
import { useEffect } from 'react';
import Gps from '../../gps/Gps';

const styles = StyleSheet.create({
  map: {
    height: 200,
    width: Dimensions.get('window').width,
  },
});

let initialRegion;
let MapComponent;
const DELTA_LATITUDE = 0.0222;
const DELTA_LONGITUDE = 0.0121;

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

export default function RewardMap(props) {
  const { setLastSeenCoords, lostObjectCoords, foundObject } = props;
  const [logMessage, setLogMessage] = useState('');
  const [logLoading, setLogLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(initialRegion);
  const [repaintPixel, setRepaintPixel] = useState(0);
  const [markerCoords, setMarkerCoords] = useState(lostObjectCoords || undefined);

  useEffect(() => console.log('userLocation', userLocation), [])

  function initMap() {
    // Se llama updateMapStyle para repintar el mapa para poder mostrar el logo de google
    // en el lugar correcto. La libreraria cuenta con un fallo y este es un workaround
    function updateMapStyle() {
      setRepaintPixel(1);
    }
    updateMapStyle();
  }

  function handlePressMap(e) {
    const coords = e.nativeEvent.coordinate
    console.log('pressed map:', coords);
    if (!lostObjectCoords) {
      setMarkerCoords(coords);
      setLastSeenCoords(coords);
    }
  }

  return (
    <View style={{
      flex: 1,
      paddingTop: repaintPixel,
    }}
    >
      <MapView
        ref={(mapView) => { MapComponent = mapView; }}
        showsUserLocation={true}
        zoomEnabled
        rotateEnabled
        zoomTapEnabled
        zoomControlEnabled
        scrollEnabled
        showsMyLocationButton
        loadingEnabled
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        mapPadding={{
          top: 0,
          right: 0,
          bottom: 10,
          left: 0,
        }}
        onMapReady={() => {
          initMap();
        }}
        onPress={handlePressMap}
        markers
      >
        {markerCoords &&
          <Marker
            key='marker'
            coordinate={markerCoords}
            title={foundObject ? 'Objecto Encontrado Aqui' : 'Último lugar visto'}
          />}
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
  )
}