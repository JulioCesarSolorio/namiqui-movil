import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  View,
  Pressable,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  Container, Content, Form, CardItem, Text,
} from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import {
  NamiquiInput, NamiquiButton, NamiquiCard, NamiquiTitle,
} from '../../styledComponents';
import { createNewUser } from '../logInUtils';
import amexLogo from '../../../assets/icons/amex.png';
import visaLogo from '../../../assets/icons/visa.png';
import masterLogo from '../../../assets/icons/mastercard.png';
import paypalLogo from '../../../assets/icons/paypal.png';

export default function PaymentDetailsScreen({ route, navigation }) {
  const { data } = route.params;
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    control, handleSubmit, errors,
  } = useForm();
  const dispatch = useDispatch();

  function choosePaymentMethod(method) {
    setPaymentMethod((old) => method);
  }

  function onSubmit(cardData) {
    const setAlertFunctions = {
      setAlertVisible,
      setAlertTitle,
      setAlertImage,
      setAlertText,
      setAlertOnDismiss,
    }
    setLoading(true);
    createNewUser({ ...data, cardData }, dispatch, setAlertFunctions)
      .then((repsonse) => {
        setLoading(false);
      })
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Container>
      <Content>
        <NamiquiTitle
          text="Datos de tarjets para adquirir mi"
          subtext={(
            <Text
              style={{
                color: '#E72945',
                fontSize: 22,
                fontFamily: 'Kollektif-Bold',
              }}
            >
              {' '}
              Plan
              {' '}
              {capitalizeFirstLetter(data.plan)}
            </Text>
          )}
        />

        <Pressable>
          <Text
            style={{
              fontSize: 14, textDecorationLine: 'underline', marginLeft: 15, marginVertical: 20,
            }}
          >
            ¿Por qué debo dar de alta una cuenta bancaria?
          </Text>
        </Pressable>

        <NamiquiTitle text="Método de pago" />
        <View style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginBottom: 20,
        }}
        >
          <NamiquiButton
            dark={paymentMethod !== 'master'}
            style={{ width: 75, borderRadius: 25 }}
            onPress={() => choosePaymentMethod('master')}
            text={(
              <View style={{ height: 50, width: '100%', backgroundColor: 'transparent' }}>
                <Image
                  source={masterLogo}
                  style={{
                    backgroundColor: 'transparent', height: '80%', resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto',
                  }}
                />
              </View>
            )}
          />

          <NamiquiButton
            dark={paymentMethod !== 'visa'}
            style={{ width: 75, borderRadius: 25 }}
            onPress={() => choosePaymentMethod('visa')}
            text={(
              <View style={{ height: 50, width: '80%', backgroundColor: 'transparent' }}>
                <Image
                  source={visaLogo}
                  style={{
                    backgroundColor: 'transparent', width: '80%', resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto',
                  }}
                />
              </View>
            )}
          />

          <NamiquiButton
            dark={paymentMethod !== 'amex'}
            style={{ width: 75, borderRadius: 25 }}
            onPress={() => choosePaymentMethod('amex')}
            text={(
              <View style={{ height: 50, width: '100%', backgroundColor: 'transparent' }}>
                <Image
                  source={amexLogo}
                  style={{
                    backgroundColor: 'transparent', width: '80%', resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto',
                  }}
                />
              </View>
            )}
          />

          <NamiquiButton
            dark={paymentMethod !== 'paypal'}
            style={{ width: 75, borderRadius: 25 }}
            onPress={() => choosePaymentMethod('paypal')}
            text={(
              <View style={{ height: 50, width: '100%', backgroundColor: 'transparent' }}>
                <Image
                  source={paypalLogo}
                  style={{
                    backgroundColor: 'transparent', height: '80%', resizeMode: 'contain', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto',
                  }}
                />
              </View>
            )}
          />
        </View>
        <NamiquiCard>
          <CardItem>
            <NamiquiTitle text="Detalles de tarjeta" />
          </CardItem>
          <Form>
            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <NamiquiInput
                  onBlur={onBlur}
                  onChangeText={(newValue) => onChange(newValue)}
                  value={value}
                  placeholder="Nombre que aparece en la tarjeta"
                />
              )}
              name="cardHolder"
              rules={{
                required: true,
              }}
              defaultValue=""
            />
            {errors.cardHolder && errors.cardHolder.type === 'required' && <CardItem><Text>Nombre de la tarjeta es un campo obligatorio</Text></CardItem>}

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <NamiquiInput
                  onBlur={onBlur}
                  onChangeText={(newValue) => onChange(newValue)}
                  value={value}
                  placeholder="Número de tarjeta"
                />
              )}
              name="cardNumber"
              rules={{
                required: true,
                // pattern: regExNumbersAndSpaces,
              }}
              defaultValue=""
            />
            {errors.cardNumber && errors.cardNumber.type === 'required' && <CardItem><Text>Número de tarjeta es un campo obligatorio</Text></CardItem>}
            {errors.cardNumber && errors.cardNumber.pattern === 'required' && <CardItem><Text>Favor de ingresar un número de tarjeta válida</Text></CardItem>}

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <NamiquiInput
                  onBlur={onBlur}
                  onChangeText={(newValue) => onChange(newValue)}
                  value={value}
                  placeholder="Expiración"
                />
              )}
              name="cardExpiration"
              rules={{
                required: true,
              }}
              defaultValue=""
            />
            {errors.cardExpiration && errors.cardExpiration.type === 'required' && <CardItem><Text>Expiración es un campo obligatorio</Text></CardItem>}

            <Controller
              control={control}
              render={({ onChange, onBlur, value }) => (
                <NamiquiInput
                  onBlur={onBlur}
                  onChangeText={(newValue) => onChange(newValue)}
                  value={value}
                  placeholder="CVV"
                />
              )}
              name="CVV"
              rules={{
                required: true,
              }}
              defaultValue=""
            />
            {errors.CVV && errors.CVV.type === 'required' && <CardItem><Text>CVV es un campo obligatorio</Text></CardItem>}
          </Form>
          <CardItem>
            <Controller
              control={control}
              render={({ onChange, value }) => (
                <CheckBox
                  disabled={false}
                  value={value}
                  onValueChange={(newValue) => onChange(newValue)}
                  tintColors={{ true: '#E72945', false: 'white' }}
                />
              )}
              name="terms"
              rules={{
                required: true,
              }}
              defaultValue=""
            />

            <Text>Guardar datos de tarjeta</Text>

          </CardItem>
          <NamiquiButton
            full
            onPress={handleSubmit(onSubmit)}
            text="Pagar"
            style={{ marginTop: 50 }}
            loading={loading}
          />
          <CardItem footer style={{ height: 200, backgroundColor: 'transparent' }} />
        </NamiquiCard>
      </Content>
    </Container>
  );
}
