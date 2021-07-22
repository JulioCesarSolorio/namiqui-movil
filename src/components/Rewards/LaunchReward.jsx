import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../styledComponents';
import { Alert, Image, Pressable, View } from 'react-native';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-community/async-storage';
import { Select } from '../elements/forms/namiquiForm';
import { colors } from '../../style';
import RewardItemImage from './RewardItemImage';

export default function LaunchReward({ navigation }) {
  const [registeredGoods, setRegisteredGoods] = useState();
  const [selectedGood, setSelectedGood] = useState();
  const [rewardAmount, setRewardAmount] = useState();
  const [formValidationErrors, setFormValidaionErrors] = useState({});
  const isFocused = useIsFocused();
  const { control, handleSubmit, errors } = useForm({ defaultValues: { selectedGood: '' } });


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

  function makePickerOptions(registeredGoods) {
    let pickerOptions = {};
    Object.keys(registeredGoods).forEach(key => pickerOptions[key] = { name: registeredGoods[key].name, value: registeredGoods[key] })
    return pickerOptions;
  }

  function onSubmit(values) {
    console.log('values', values);
    if (values.selectedGood !== undefined) {
      setSelectedGood(values.selectedGood)
      setFormValidaionErrors((state) => ({ ...state, selectedGood: false }))
    }
  }

  function handleSelectAmount(amount) {
    console.log('amount', amount)
    setRewardAmount(amount)
    setFormValidaionErrors((state) => ({ ...state, rewardAmount: false }))
  }

  function handleLaunchReward() {
    let errors = {};
    if (!selectedGood) {
      errors.selectedGood = 'true'
    }
    if (!rewardAmount) {
      errors.rewardAmount = 'true'
    }
    if (Object.keys(errors).length < 1) {
      Alert.alert('this is where it would send the Reward to the back');
      // Send reward to back, then navigate to ActiveRewards.
      navigation.navigate('Active Rewards')
    } else {
      setFormValidaionErrors(errors);
    }
  }

  function AmountButton(props) {
    const { amount } = props;
    let backgroundColor;
    amount === rewardAmount ? backgroundColor = colors.COLOR_SELECTED : colors.COLOR_BACKGROUND_GRAY_STRONG
    return (
      <Pressable
        onPress={() => handleSelectAmount(amount)}
        style={{
          height: 50,
          width: 100,
          borderRadius: 25,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: colors.COLOR_BORDER,
          borderWidth: 1,
          backgroundColor,
          marginVertical: 10
        }}>
        <Text>{amount}</Text>
      </Pressable>
    )
  };

  function ErrorText(props) {
    return (
      <Text style={{ fontSize: 12, color: colors.COLOR_DANGER }}>{props.children}</Text>
    )
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Lanzar Recompensa" />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginVertical: 25
        }}>
          <View style={{ minWidth: 200 }}>
            {registeredGoods ? <Select
              name="selectedGood"
              control={control}
              errors={errors}
              rules={{
                required: true,
              }}
              options={makePickerOptions(registeredGoods)}
            />
              :
              <Text>No cuentas con bienes registrados todavía.</Text>
            }
            {formValidationErrors.selectedGood && <ErrorText>Favor de escoger un bien</ErrorText>}
          </View>

          {registeredGoods && <NamiquiButton text="Seleccionar" onPress={handleSubmit(onSubmit)} style={{ width: 150 }} />}
        </View>
        {selectedGood && (
          <>
            <Text>Nombre del bien: {selectedGood.name}</Text>
            <Text>Descripción del bien: {selectedGood.description}</Text>
          </>
        )}
        {selectedGood?.images && (
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
            {selectedGood.images?.map((image, i) => <RewardItemImage source={{ uri: image }} key={`${selectedGood.name}-${i}`} />)}
          </View>
        )}
        <Text>Cantidad de la recompensa</Text>
        <View style={{ width: "100%", display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <AmountButton amount='500' />
          <AmountButton amount='1000' />
          <AmountButton amount='1500' />
          <AmountButton amount='2000' />
          <AmountButton amount='3000' />
          <AmountButton amount='5000' />
        </View>
        {formValidationErrors.rewardAmount && <ErrorText>Favor de escoger una cantidad para la recompensa.</ErrorText>}

        <Text style={{ fontSize: 12 }}>
          El impuesto retenido es del 2% como ISR y 16% como IVA, la comisión para Namiqui es del 10%
        </Text>

        <NamiquiButton text="Lanzar Ahora" onPress={handleLaunchReward} />
      </Content>
    </Container>
  )
}