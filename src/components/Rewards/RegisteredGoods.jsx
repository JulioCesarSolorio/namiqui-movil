import React, { useState } from 'react';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import { Image, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { Select } from '../elements/forms/namiquiForm';
import TEMPregisterdGoods from '../../constants/TEMPregisterdGoods';

export default function RegisteredGoods({ navigation }) {
  const [selectedGood, setSelectedGood] = useState();
  // Pull these from Local Storage
  // Items must have NAME and VALUE keys
  // VALUE key must be the objects index in the Array
  const registeredGoods = TEMPregisterdGoods;
  const {
    control, handleSubmit, errors
  } = useForm({ defaultValues: { 'RegisteredGood': registeredGoods[0] } });

  function onSubmit(value) {
    setSelectedGood(value['RegisteredGood']);
  }

  function registerNewItem() {
    console.log('clicked registerNewItem');
  }

  function goToEditGood(item) {
    console.log('clicked goToEditGood');
    navigation.navigate('Edit Good', {good: item});
  }

  function ItemImage(props) {
    return (
      <View style={{ height: 80, width: 80, margin: 20 }}>
        <Image
          source={props.source}
          style={{
            width: 80,
            height: 80,
          }}
        />
      </View>)
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Bienes Registrados" />
        <NamiquiButton text="Agregar Nuevo Registro" onPress={registerNewItem} style={{ marginVertical: 50 }} />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
          <View style={{ minWidth: 200 }}>
            <Select
              name="RegisteredGood"
              control={control}
              errors={errors}
              rules={{
                required: true,
              }}
              options={registeredGoods}
            />
          </View>
          <NamiquiButton text="Seleccionar" onPress={handleSubmit(onSubmit)} style={{ marginVertical: 50, width: 150 }} />
        </View>
        {registeredGoods[selectedGood]?.description && <Text>Descripción: {registeredGoods[selectedGood]?.description}</Text>}
        {registeredGoods[selectedGood]?.images && (
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
            {registeredGoods[selectedGood]?.images.map((image, i) => <ItemImage source={image} key={`${registeredGoods[selectedGood].name}-${i}`} />)}
          </View>)}

        <NamiquiButton text="Editar Bien" onPress={() => goToEditGood(registeredGoods[selectedGood])} />
      </Content>
    </Container>
  )
}