import {
  Container, Content, Text,
} from 'native-base';
import React from 'react';
import { View, ScrollView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { NamiquiButton } from '../styledComponents';
import { colors } from '../../style';
import HelpButtonIOS from '../Help/HelpButton/HelpButtonIOS';

export default function MapCrimeAreaDetailScreen({ route, navigation }) {
  const { area } = route.params;
  const showingIOSButton = useSelector((state) => state.userReducers.showIOSButton);

  return (
    <Container>
      <Content>
        <View>
          <ScrollView>
            <View style={{
              flexDirection: 'row',
              padding: 20,
            }}
            >
              <View style={{
                marginRight: 10,
              }}
              >
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Nivel de peligro</Text>
              </View>
              <View style={{
                flexDirection: 'row',
              }}
              >
                <View style={{
                  backgroundColor: area.status.color,
                  height: 35,
                  width: 35,
                }}
                />
                <View style={{
                  height: 35,
                  width: 120,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                >
                  <Text style={{
                    color: colors.COLOR_TEXT_BLACK_DEFAULT,
                  }}
                  >
                    {area.status.type}
                  </Text>
                </View>
              </View>
            </View>
            <MapView
              initialRegion={{
                latitude: area.coords.latitude,
                longitude: area.coords.longitude,
                latitudeDelta: 0.0150,
                longitudeDelta: 0.0150,
              }}
              zoomEnabled={false}
              zoomTapEnabled={false}
              provider={PROVIDER_GOOGLE}
              rotateEnabled={false}
              scrollEnabled={false}
              style={{
                height: 200,
              }}
            >
              <Polygon
                coordinates={area.polygon}
                strokeColor="#F00"
                fillColor={area.status.color}
                strokeWidth={1}
                lineDashPhase={3}
              />
            </MapView>
            <View style={{
              padding: 20,
            }}
            >
              <View style={{
                marginTop: 10,
              }}
              >
                <Text style={{ fontSize: 18 }}>
                  Estado:
                  {area.state}
                </Text>
                <Text style={{ fontSize: 18 }}>
                  Ciudad:
                  {area.city}
                </Text>
                <Text style={{ fontSize: 18 }}>
                  CP:
                  {area.postalCode}
                </Text>
              </View>
              {(area.crimes.length) &&
                (
                <View style={{
                  marginTop: 20,
                }}
                >
                  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Lista de delitos</Text>
                </View>
                )
              }
              {Object.keys(area.crimes).map((k) => {
                const crime = area.crimes[k];

                return (

                  <View
                    key={k}
                    style={{
                      flexDirection: 'row',
                      flex: 4,
                    }}
                  >
                    <View style={{ flex: 3, justifyContent: 'center' }}><Text>{crime.name[0].toUpperCase() + crime.name.substring(1).toLowerCase()}</Text></View>
                    <View style={{
                      height: 40,
                      width: 40,
                      borderWidth: 2,
                      borderRadius: 20,
                      borderColor: colors.COLOR_SELECTED,
                      justifyContent: 'center',
                    }}
                    >
                      <Text style={{ textAlign: 'center' }}>{crime.num}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Content>
      <View>
        <NamiquiButton
          full
          style={{ margin: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
          text="Volver al Mapa"
        />
      </View>
      <HelpButtonIOS navigation={navigation} showing={showingIOSButton} />
    </Container>
  );
}
