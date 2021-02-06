import React from 'react';
import { Marker, Heatmap } from 'react-native-maps';
import { Image } from 'react-native';

export default function MapCrimesLayer(props) {
  if (props.crimeMap.data.length) {
    return (
      <>
        {(props.crimeMap.showCrimes)

          && Object.keys(props.crimeMap.data).map((k) => {
            const crime = props.crimeMap.data[k];
            return (
              <Marker
                key={k}
                coordinate={{
                  latitude: crime.latitude,
                  longitude: crime.longitude,
                }}
                title={crime.type.name}
                description={crime.description}
                onPress={() => {
                  console.log(crime);
                }}
              >
                <Image
                  source={crime.icon}
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                  }}
                />
              </Marker>
            );
          })}
        {(props.crimeMap.showHeatmap)

          && (
          <Heatmap
            points={props.crimeMap.data}
            opacity={0.7}
            radius={props.crimeMap.heatmap_point_size} // entre mas delitos mas pequeño se vuelve el punto de calor
            maxIntensity={100}
            gradientSmoothing={10}
            heatmapMode="POINTS_DENSITY"
          />
          )}
      </>
    );
  }

  return null;
}
