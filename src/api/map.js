import Config from 'react-native-config';
import { Platform } from 'react-native';
import apiRequest from './apiRequest';
import REQAssets from '../assets/request/REQAssets';

function calculateHeatmapPonitSize(dataArray) {
  let heatmapPointSize = 1;

  /*
    algoritmo para ajustar los puntos de calor
    dependiendo del numero de delitos
    ESTE ALGOTIRITMO HAY QUE DEFINIRLO MUY BIEN O QUE EL PARAMETRO "heatmapPointSize"
    VENGA DESDE EL BACK PARA EVITAR PROBLEMAS EN EL FUTURO
    */
  if (dataArray.length <= 10) {
    heatmapPointSize = 20;
  } else if (dataArray.length > 10 && dataArray.length <= 500) {
    heatmapPointSize = 15;
  } else if (dataArray.length > 100 && dataArray.length <= 1000) {
    heatmapPointSize = 12;
  } else if (dataArray.length > 1000 && dataArray.length <= 5000) {
    heatmapPointSize = 10;
  } else if (dataArray.length > 5000) {
    heatmapPointSize = 5;
  }

  // hacer los puntos 3 veces mas grandes para iOS para que se alcancen a apreciar en el mapa
  if (Platform.OS === 'ios') {
    heatmapPointSize *= 3;
  }

  return heatmapPointSize;
}

//= ===================================== BACKEND CALLS =========================================

export async function getCrimeMap(token, latitude, longitude, filters) {
  const myHeaders = new Headers();

  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token} `);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  if (latitude && longitude) {

    return apiRequest(
      `${Config.NAMIQUI_GATEWAY}/api/core/crime-data?lat=${latitude}&lng=${longitude}&radius=1000`,
      requestOptions,
      'getCrimeMap',
    )
      .then((result) => {
        const tempCrimeMap = result;

        if (tempCrimeMap !== undefined && !tempCrimeMap.errors) {
          const data = [];
          const delitos=[];
         
          
          console.log(delitos);
          var crimenes=0;
          Object.keys(tempCrimeMap.data).forEach((k) => {
            const crime = tempCrimeMap.data[k];
            crime.icon = REQAssets.getCrimeIconMap(crime);
            crime.latitude = parseFloat(tempCrimeMap.data[k].lat);
            crime.longitude = parseFloat(tempCrimeMap.data[k].lng);

            if (filters.crimeTypes.length > 0) {
              // filtrar si el tipo de crimen viene en los filtros
              
              Object.keys(filters.crimeTypes).forEach((crimeType) => {
                if (filters.crimeTypes[crimeType].id === crime.app_crime_act_id) {
                  crime.type = filters.crimeTypes[crimeType];
                  //delitos[filters.crimeTypes[crimeType].id].total++;
                  //crime.latitude =crime.latitude+(.00005*crimenes);
                  //crime.longitude = crime.longitude+(.00005*crimenes);
                  crimenes++;
                  var encontre=0;
                  
                  for(var x=0;x<data.length;x++)
                  {
                    
                    if(data[x].app_crime_act_id === crime.app_crime_act_id)
                    {
                      
                      if(crime.latitude ==data[x].latitude){
                        data[x].numerIncidents+=crime.numerIncidents;
                       
                      encontre++
                      }
                      
                    }
                  }
                  if(encontre==0){
                    
                    data.push(crime);}
                  
                }
              });
            }
          });

                  var pos=0;
                  for(var x=0;x<data.length;x++)
                  {
                    switch(pos)
                    {
                      case 0:
                        { data[x].latitude =data[x].latitude+(.0005);
                          data[x].longitude = data[x].longitude+(.0005);
                          pos=1;
                          break;
                        }
                      case 1: { data[x].latitude =data[x].latitude+(-.0005);
                        data[x].longitude = data[x].longitude+(.0005);
                        pos=2;
                        break;
                      }
                      case 2: { data[x].latitude =data[x].latitude+(-.0005);
                        data[x].longitude = data[x].longitude+(-.0005);
                        pos=3;
                        break;
                      }
                      case 3: { data[x].latitude =data[x].latitude+(.0005);
                        data[x].longitude = data[x].longitude+(-.0005);
                        pos=4;
                        break;
                      }
                      case 4: { data[x].latitude =data[x].latitude;
                        data[x].longitude = data[x].longitude+(-.0005);
                        pos=5;
                        break;
                      }
                      case 5: { data[x].latitude =data[x].latitude+(-.0005);
                        data[x].longitude = data[x].longitude;
                        pos=6;
                        break;
                      }
                      case 6: { data[x].latitude =data[x].latitude+(.0005);
                        data[x].longitude = data[x].longitude;
                        pos=7;
                        break;
                      }
                      case 7: { data[x].latitude =data[x].latitude;
                        data[x].longitude = data[x].longitude+(.0005);
                        pos=8;
                        break;
                      }
                      case 8: { data[x].latitude =data[x].latitude;
                        data[x].longitude = data[x].longitude;
                        pos=0;
                        break;
                      }

                    }
                    //data[x].latitude =data[x].latitude+(.0002*(data[x].app_crime_act_id-1));
                    //data[x].longitude = data[x].longitude+(.0002*(data[x].app_crime_act_id-1));
                    data[x].description="num:"+data[x].numerIncidents;
                    //data[x].name+="num:"+data[x].numerIncidents;
                    
                  }
                  
          console.log(data);

          tempCrimeMap.data = data;
          tempCrimeMap.heatmap_point_size = calculateHeatmapPonitSize(data);
        }

        return tempCrimeMap;
      })
      .catch((error) => {
        throw Error;
      });
  }

  return new Promise(((resolve) => resolve({
    errors: 'Se necesita la ubicación del usuario para cargar estos datos.',
    data: [],
  })));
}

export async function getCrimeAreasMap(token, latitude, longitude) {
  const myHeaders = new Headers();

  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token} `);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  return fetch(`${Config.NAMIQUI_GATEWAY}/api/core/polygon/byLatLngRadius?lat=${latitude}&lng=${longitude}&radius=1000`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => {
      throw Error;
    });
}

export const estados = [
  { value: 1, name: 'Aguascalientes' },
  { value: 2, name: 'Baja California' },
  { value: 3, name: 'Baja California Sur' },
  { value: 4, name: 'Campeche' },
  { value: 5, name: 'Coahuila de Zaragoza' },
  { value: 6, name: 'Colima' },
  { value: 7, name: 'Chiapas' },
  { value: 8, name: 'Chihuahua' },
  { value: 9, name: 'Distrito Federal' },
  { value: 10, name: 'Durango' },
  { value: 11, name: 'Guanajuato' },
  { value: 12, name: 'Guerrero' },
  { value: 13, name: 'Hidalgo' },
  { value: 14, name: 'Jalisco' },
  { value: 15, name: 'México' },
  { value: 16, name: 'Michoacán de Ocampo' },
  { value: 17, name: 'Morelos' },
  { value: 18, name: 'Nayarit' },
  { value: 19, name: 'Nuevo León' },
  { value: 20, name: 'Oaxaca' },
  { value: 21, name: 'Puebla' },
  { value: 22, name: 'Querétaro' },
  { value: 23, name: 'Quintana Roo' },
  { value: 24, name: 'San Luis Potosí' },
  { value: 25, name: 'Sinaloa' },
  { value: 26, name: 'Sonora' },
  { value: 27, name: 'Tabasco' },
  { value: 28, name: 'Tamaulipas' },
  { value: 29, name: 'Tlaxcala' },
  { value: 30, name: 'Veracruz' },
  { value: 31, name: 'Yucatán' },
  { value: 32, name: 'Zacatecas' },
];
