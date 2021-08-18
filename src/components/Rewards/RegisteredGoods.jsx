import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import { Alert, Image, View } from 'react-native';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-community/async-storage';
import { Select } from '../elements/forms/namiquiForm';
import RewardItemImage from './RewardItemImage';

export default function RegisteredGoods({ navigation }) {
  const [registeredGoods, setRegisteredGoods] = useState();
  const [selectedGood, setSelectedGood] = useState();
  console.log('RegisteredGoods registeredGoods', registeredGoods);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function getRegisteredGoods() {
      try {
        const jsonValue = await AsyncStorage.getItem('registeredGoods')
        jsonValue != null ? setRegisteredGoods(JSON.parse(jsonValue)) : null;
      } catch (e) {
        Alert.alert('problem', e);
      }
    }
    if (isFocused) {
      getRegisteredGoods();
    }
  }, [isFocused]);

  useEffect(() => {
    if (selectedGood && registeredGoods[selectedGood.goodId]) {
      setSelectedGood(registeredGoods[selectedGood.goodId]);
    } else {
      setSelectedGood(undefined);
    }
  }, [registeredGoods])

  const {
    control, handleSubmit, errors
  } = useForm({ defaultValues: { SelectedGood: '' } });

  function onSubmit(value) {
    console.log('setting as:', value['SelectedGood'])
    setSelectedGood(value['SelectedGood']);
  }

  function registerNewItem() {
    navigation.navigate('Edit Good');
  }

  function goToEditGood() {
    navigation.navigate('Edit Good', { good: selectedGood });
  }

  function makePickerOptions(registeredGoods) {
    let pickerOptions = {};
    Object.keys(registeredGoods).forEach(key => pickerOptions[key] = { name: registeredGoods[key].name, value: registeredGoods[key] })
   console.log('pickerOptions', pickerOptions)
    return pickerOptions;
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Bienes Registrados" />
        {!registeredGoods && <Text>Aún no tienes bienes registrados en este dispositivo.</Text>}
        <NamiquiButton text="Agregar Nuevo Registro" onPress={registerNewItem} style={{ marginVertical: 50 }} />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
          <View style={{ minWidth: 200 }}>
            {registeredGoods && <Select
              name="SelectedGood"
              control={control}
              errors={errors}
              rules={{
                required: true,
              }}
              options={makePickerOptions(registeredGoods)}
            />}
          </View>
          {registeredGoods && <NamiquiButton text="Seleccionar" onPress={handleSubmit(onSubmit)} style={{ marginVertical: 50, width: 150 }} />}
        </View>
        {selectedGood?.description && <Text>Descripción: {selectedGood.description}</Text>}
        {selectedGood?.images && (
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
            {selectedGood.images.map((image, i) => <RewardItemImage source={{ uri: image }} key={`${selectedGood.name}-${i}`} />)}
          </View>)}

        {selectedGood && <NamiquiButton disabled={!selectedGood} text="Editar Bien" onPress={goToEditGood} />}
      </Content>
    </Container>
  )
}