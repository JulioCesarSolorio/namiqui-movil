import React, { useState, useEffect } from 'react';
import { Polygon } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import { getCrimeAreasMap } from '../../../../api/map';
import { silentRefreshJWT } from '../../../LogIn/logInUtils';
import failureIcon from '../../../../assets/icons/alerta_2.png';

export default function MapCrimeAreaLayer(props) {
  const {
    setAlertVisible,
    setAlertTitle,
    setAlertImage,
    setAlertText,
  } = props;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userReducers.JWT);
  const expirationDate = useSelector((state) => state.userReducers.JWTExpiration);
  const refreshToken = useSelector((state) => state.userReducers.refreshToken);

  useEffect(() => {
    console.log('actualizar poligonos');

    updateMap();
  }, [props.userLocation]);

  const [crimeAreasMap, setCrimeAreas] = useState({
    data: [],
  });

  function updateMap() {
    if (props.userLocation.latitude && props.userLocation.longitude) {
      silentRefreshJWT(refreshToken, dispatch, expirationDate)
        .then(
          () => getCrimeAreasMap(
            token, props.userLocation.latitude,
            props.userLocation.longitude
          )
            .then((response) => {
              if (!response.errors) {
                setCrimeAreas({
                  data: response.data,
                });
              }
            })
            .catch(() => {
              setAlertVisible(true);
              setAlertTitle('Error');
              setAlertText('Ocurrió un error inesperado al tratar de cargar los poligonos del mapa.');
              setAlertImage(failureIcon);
            }))
        .catch(() => {
          setAlertVisible(true);
          setAlertTitle('Error');
          setAlertText('Ocurrió un error inesperado al tratar de renovar JWT.');
          setAlertImage(failureIcon);
        });
    }
  }

  return (
    <>
      {(crimeAreasMap && crimeAreasMap.data && crimeAreasMap.data.length > 0)

        && Object.keys(crimeAreasMap.data).map((k) => {
          const area = crimeAreasMap.data[k];

          return (
            <Polygon
              key={k}
              coordinates={area.polygon}
              strokeColor="#F00"
              fillColor={area.status.color}
              strokeWidth={1}
              lineDashPhase={3}
              tappable
              onPress={() => {
                props.navigation.navigate('Detalle Del Área', {
                  area,
                });
              }}
            />

          );
        })}
    </>
  );
}
