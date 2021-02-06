import React, { useState } from 'react';
import {
  FlatList, TouchableWithoutFeedback, TouchableOpacity, Modal, ActivityIndicator, Switch, Image, Pressable,
} from 'react-native';
import { View, Text, Badge } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../../../style';
import { NamiquiAlert, NamiquiButton } from '../../styledComponents';
import { getCriminalActTypes } from '../../../api/crimes';
import { getCrimeMap } from '../../../api/map';
import { silentRefreshJWT } from '../../LogIn/logInUtils';
import Gps from '../../../gps/Gps';
import failureIcon from '../../../assets/icons/alerta_2.png';
import closeIcon from '../../../assets/icons/times.png';

function FilterButton(props) {
  return (
    <View>
      <TouchableWithoutFeedback onPress={() => {
        props.onPress();
      }}
      >
        <View style={{
          backgroundColor: (props.active) ? colors.COLOR_SELECTED : 'white',
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderRadius: 30,
          width: 150,
        }}
        >
          <Text style={{
            textAlign: 'center',
            fontSize: 14,
            color: (props.active) ? 'white' : colors.COLOR_SELECTED,
          }}
          >
            {props.title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default function ModalCrimesForm(props) {
  const { modalOpen, closeModal, onUpdate } = props;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userReducers.JWT);
  const expirationDate = useSelector((state) => state.userReducers.JWTExpiration);
  const refreshToken = useSelector((state) => state.userReducers.refreshToken);

  const [selectedCrimeTypesInFilters, setCrimeTypesSelectedFilters] = useState([]);
  const [crimeTypesFilters, setCrimeFilters] = useState([]);
  const [criminalActTypes, setCriminalActTypes] = useState([]);
  const [showCrimes, setShowCrimes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [gettingMapData, setGettingMapData] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Alerta');
  const [alertImage, setAlertImage] = useState(failureIcon);
  const [alertText, setAlertText] = useState('Una alerta genérica');
  const [alertOnDismiss] = useState(undefined);

  function closeAlert() {
    setAlertVisible(false);
  }

  function errorOnGetCrimes(error) {
    onUpdate({
      showCrimes,
      showHeatmap,
      data: [],
      heatmap_point_size: 0,
    }, error);

    setGettingMapData(false);
  }

  function update(position) {
    // se actualiza el token
    silentRefreshJWT(refreshToken, dispatch, expirationDate)
      // se obtiene el mapa con la ubicacion del usuario
      .then(() => getCrimeMap(token, position.coords.latitude, position.coords.longitude, {
        crimeTypes: crimeTypesFilters,
      })
        .then((response) => {
          if (!response.errors) {
            // se acutalizan los componentes
            onUpdate({
              showCrimes,
              showHeatmap,
              data: response.data,
              heatmap_point_size: response.heatmap_point_size,
            });

            // se deja de mostrar el loading
            setGettingMapData(false);
          } else {
            errorOnGetCrimes(response.errors.message);
          }
        })
        .catch(() => {
          errorOnGetCrimes('Ocurrió un error inesperado al tratar de cargar los delitos.');
        }));
  }

  function loadCrimeFilters() {
    if (criminalActTypes && criminalActTypes.length <= 0) {
      silentRefreshJWT(refreshToken, dispatch, expirationDate)
        .then(() => getCriminalActTypes(token)
          .then((response) => {
            if (response === undefined) {
              setAlertVisible(true);
              setAlertTitle('Error');
              setAlertText('No tienes conexión a internet');
              setAlertImage(failureIcon);
            } else if (!response.errors) {
              setCriminalActTypes(response.data);
            } else {
              let msj = 'Se presentaron los siguientes errores: ';
              Object.keys(response.errors)
                .forEach((k) => {
                  msj += `${response.errors[k]} `;
                });
              setAlertVisible(true);
              setAlertTitle('Error');
              setAlertText(msj);
              setAlertImage(failureIcon);
            }
          })
          .catch(() => {
            errorOnGetCrimes('Ocurrió un error inesperado al tratar de cargar los filtros.');
          }))
        .catch(() => {
          errorOnGetCrimes('Ocurrió un error inesperado al tratando de renovar JWT.');
        });
    }
  }

  function updateMapData() {
    if (crimeTypesFilters.length > 0) {
      setGettingMapData(true);

      // obtener la ultima ubicacion del usuario
      Gps.getUserLastPosition((position) => {
        update(position);
      });
    } else {
      setAlertVisible(true);
      setAlertTitle('Error');
      setAlertText('Debes seleccionar al menos un tipo de delito para cargar el mapa.');
      setAlertImage(failureIcon);
    }
  }

  function selectCrimeType(crimeType) {
    const selectedCrimes = selectedCrimeTypesInFilters;

    // si no se ha seleccionado el delito se agrega al array
    if (!selectedCrimes[crimeType.id]) {
      // se agrega a la lista
      selectedCrimes[crimeType.id] = crimeType;
    } else {
      // se elimina en caso de que se le de click si ya estaba seleccionado
      selectedCrimes[crimeType.id] = undefined;
    }

    // se guarda el state para actualizar la GUI
    setCrimeTypesSelectedFilters(selectedCrimes);

    const crimeTypeFilters = [];

    // de los delitos seleccionados en la GUI se actualizan los delitos a enviar
    Object.keys(selectedCrimes).forEach((index) => {
      if (selectedCrimes[index]) {
        crimeTypeFilters.push(selectedCrimes[index]);
      }
    });

    // estos son los delitos que se enviaran a otro componente
    setCrimeFilters(crimeTypeFilters);
  }

  return (
    <Modal
      animationType="slide"
      visible={modalOpen}
      transparent
      onShow={() => {
        loadCrimeFilters();
      }}
    >
      <View style={{
        flex: 1,
        padding: 20,
        paddingHorizontal: 10,
        backgroundColor: colors.COLOR_BACKGROUND_GRAY_STRONG,
        position: 'relative',
      }}
      >
        <Pressable
          style={{
            height: 20,
            width: 20,
            top: 40,
            right: 20,
            position: 'absolute',
            zIndex: 100,
          }}
          onPress={closeModal}
        >
          <Image
            source={closeIcon}
            style={{
              height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto',
            }}
          />
        </Pressable>
        <View>
          <Text style={{
            fontSize: 22,
            textAlign: 'center',
            marginBottom: 6,
            marginTop: 20,
          }}
          >
            Listado de delitos
          </Text>
          <Text style={{
            textAlign: 'center',
          }}
          >
            Elige tu visualización
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          paddingVertical: 20,
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
        >
          <FilterButton
            title={(!showCrimes) ? 'Mostrar Delitos' : 'Ocultar Delitos'}
            active={showCrimes}
            onPress={() => {
              setShowCrimes(!showCrimes);
            }}
          />
          <FilterButton
            title={(!showHeatmap) ? 'Mostrar Calor' : 'Ocultar Calor'}
            active={showHeatmap}
            onPress={() => {
              setShowHeatmap(!showHeatmap);
            }}
          />
        </View>
        {(criminalActTypes && criminalActTypes.length > 0)
          ? (
            <FlatList
              data={criminalActTypes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={(crimeType) => {
                const crimeTypeItem = crimeType.item;

                return (
                  <View style={{
                    flexDirection: 'row',
                    flex: 10,
                    paddingVertical: 8,
                  }}
                  >
                    <View style={{ flex: 2 }}>
                      <Image
                        source={{
                          uri: crimeTypeItem.url_img_catalog,
                        }}
                        style={{
                          width: 40,
                          height: 40,
                        }}
                      />
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                      <Text style={{ fontSize: 18 }}>{crimeTypeItem.name}</Text>
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center' }}>
                      {(!crimeTypeItem.is_pro)
                        ? (
                          <Switch
                            trackColor={{ false: 'white', true: colors.COLOR_SELECTED }}
                            thumbColor="white"
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => {
                              selectCrimeType(crimeTypeItem);
                            }}
                            value={Boolean(selectedCrimeTypesInFilters[crimeTypeItem.id])}
                          />
                        )
                        : (
                          <TouchableOpacity onPress={() => {
                            setAlertVisible(true);
                            setAlertTitle('Filtro no disponible');
                            setAlertText('La visualización de este delito solo está disponible para usuarios PRO.');
                            setAlertImage(failureIcon);
                          }}
                          >
                            <Badge>
                              <Text>PRO</Text>
                            </Badge>
                          </TouchableOpacity>
                        )}

                    </View>
                  </View>

                );
              }}
            />
          )
          : (
            <View style={{
              flex: 1,
              justifyContent: 'center',
            }}
            >
              <ActivityIndicator size={50} color={colors.COLOR_SELECTED} />
            </View>
          )}
      </View>
      <View style={{
        backgroundColor: colors.COLOR_BACKGROUND_GRAY_STRONG,
        paddingBottom: 10,
      }}
      >
        <View>
          <NamiquiButton
            full
            onPress={() => {
              updateMapData();
            }}
            text="Actualizar Mapa"
            loading={gettingMapData}
          />
        </View>
      </View>
      <NamiquiAlert
        visible={alertVisible}
        message={alertText}
        image={alertImage}
        title={alertTitle}
        closeModal={closeAlert}
        onDismiss={alertOnDismiss}
      />
    </Modal>
  );
}
