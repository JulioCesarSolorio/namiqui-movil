import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Container, Content, Text } from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { NamiquiButton, NamiquiInput, NamiquiTitle } from '../styledComponents';
import { Alert, Image, Pressable, View } from 'react-native';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-community/async-storage';
import { Select } from '../elements/forms/namiquiForm';
import { colors } from '../../style';
import RewardItemImage from './RewardItemImage';
import ErrorText from '../elements/forms/ErrorText';
import RewardMap from './RewardMap';

export default function LaunchReward({ navigation }) {
  const [registeredGoods, setRegisteredGoods] = useState();
  const [selectedGood, setSelectedGood] = useState();
  const [rewardAmount, setRewardAmount] = useState();
  const [customAmount, setCustomAmount] = useState();
  const [lossLocation, setLossLocation] = useState();
  const [lastSeenCoords, setLastSeenCoords] = useState();
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

  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  function makePickerOptions(registeredGoods) {
    let pickerOptions = {};
    Object.keys(registeredGoods).forEach(key => pickerOptions[key] = { name: registeredGoods[key].name, value: registeredGoods[key] })
    return pickerOptions;
  }

  function onSubmit(values) {
    console.log('values', values);
    if (values.selectedGood !== undefined) {
      setSelectedGood(values.selectedGood);
      setFormValidaionErrors((state) => ({ ...state, selectedGood: false }));
    }
  }

  function handleChangeLastSeenText(newText) {
    setLossLocation(newText);
    newText.length > 0 && setFormValidaionErrors((state) => ({ ...state, lossLocation: false }));

  }

  function handleChangeCoords(coords) {
    setLastSeenCoords(coords);
    setFormValidaionErrors((state) => ({ ...state, lastSeenCoords: false }));
  }

  function handleSelectAmount(amount) {
    console.log('amount', amount);
    setRewardAmount(amount);
    setFormValidaionErrors((state) => ({ ...state, rewardAmount: false, amountIsNotNumber: false }));
  }

  function handleLaunchReward() {
    let errors = {};
    if (!selectedGood) {
      errors.selectedGood = true;
    }
    if (!rewardAmount) {
      errors.rewardAmount = true;
    }
    if (rewardAmount === "Otra" && !customAmount) {
      errors.rewardAmount = true;
    }
    if (rewardAmount === "Otra" && !isNumeric(customAmount)) {
      errors.amountIsNotNumber = true;
    }
    if (!lossLocation) {
      errors.lossLocation = true;
    }
    if (!lastSeenCoords) {
      errors.lastSeenCoords = true;
    }
    if (Object.keys(errors).length < 1) {
      Alert.alert('this is where it would send the Reward to the back');
      // Send reward to back, then navigate to ActiveRewards.
      // Check it amount is custom, and add accordingly
      // Add coords from map
      navigation.navigate('Active Rewards');
    } else {
      setFormValidaionErrors(errors);
    }
  }

  function handleChangeCustomAmount(newValue) {
    setCustomAmount(newValue);
    setFormValidaionErrors((state) => ({ ...state, amountIsNotNumber: false }));
  }

  function AmountButton(props) {
    const { amount } = props;
    let backgroundColor;
    amount === rewardAmount ? backgroundColor = colors.COLOR_SELECTED : colors.COLOR_BACKGROUND_GRAY_STRONG;
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



  return (
    <Container style={{ flexGrow: 1 }}>
      <Content style={{ paddingHorizontal: 20 }}>
        <NamiquiTitle text="Lanzar Recompensa" />
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
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

          </View>
          {registeredGoods && <NamiquiButton text="Seleccionar" onPress={handleSubmit(onSubmit)} style={{ width: 150, borderWidth: formValidationErrors.selectedGood ? 1 : 0, borderColor: 'white' }} />}

        </View>
        {formValidationErrors.selectedGood && <ErrorText>Favor de escoger un bien con el boton</ErrorText>}

        {selectedGood && (
          <>
            <Text style={{ marginVertical: 25 }}>Nombre del bien: {selectedGood.name}</Text>
            <Text>Descripción del bien: {selectedGood.description}</Text>
          </>
        )}
        {selectedGood?.images && (
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
            {selectedGood.images?.map((image, i) => <RewardItemImage source={{ uri: image }} key={`${selectedGood.name}-${i}`} />)}
          </View>
        )}

        <Text style={{ marginVertical: 10 }}>Último lugar visto</Text>
        <NamiquiInput
          onChangeText={handleChangeLastSeenText}
          value={lossLocation}
          placeholder=""
          multiline
        />
        {formValidationErrors.lossLocation && <ErrorText>Favor de escribir dónde último viste el bien.</ErrorText>}

        <RewardMap setLastSeenCoords={handleChangeCoords} />
        {formValidationErrors.lastSeenCoords && <ErrorText>Favor de escoger una ubicación en el mapa.</ErrorText>}

        <Text style={{ marginVertical: 10 }}>Cantidad de la recompensa</Text>
        <View style={{ width: "100%", display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>
          <AmountButton amount='500' />
          <AmountButton amount='1000' />
          <AmountButton amount='1500' />
          <AmountButton amount='2000' />
          <AmountButton amount='3000' />
          <AmountButton amount='5000' />
          <AmountButton amount='Otra' />
          {rewardAmount === "Otra" &&
            <NamiquiInput
              onChangeText={(newValue) => handleChangeCustomAmount(newValue)}
              value={customAmount}
              placeholder=""
              viewStyle={{ marginHorizontal: 20 }}

            />
          }
        </View>

        <View style={{ display: 'flex', flexDirection: 'row' }}>

        </View>

        {formValidationErrors.rewardAmount && <ErrorText>Favor de escoger una cantidad para la recompensa.</ErrorText>}
        {formValidationErrors.amountIsNotNumber && <ErrorText>La cantidad solo puede contener números.</ErrorText>}

        <Text style={{ fontSize: 12 }}>
          El impuesto retenido es del 2% como ISR y 16% como IVA, la comisión para Namiqui es del 10%
        </Text>

        <NamiquiButton style={{ marginTop: 25 }} text="Lanzar Ahora" onPress={handleLaunchReward} />
      </Content>
    </Container>
  )
}