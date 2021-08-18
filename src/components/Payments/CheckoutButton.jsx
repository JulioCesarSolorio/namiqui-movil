import React, { useEffect, useState } from 'react';
import Config from 'react-native-config';
import { useStripe } from '@stripe/stripe-react-native';
import { NamiquiButton, NamiquiAlert } from '../styledComponents';
import { Text } from 'native-base'
import failureIcon from '../../assets/icons/alerta_2.png';
import successIcon from '../../assets/icons/Icon_Verificacion.png';

export default function CheckoutButton(props) {
// Pass a product in props, this product will be sent to backEnd for creating the order
  
  const { navigation, closeParentModal, product } = props;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(undefined);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Alerta');
  const [alertImage, setAlertImage] = useState(failureIcon);
  const [alertText, setAlertText] = useState('Una alerta genérica');

  function goHome() {
    closeParentModal();
    navigation.navigate('Home');
  }

  const fetchPaymentSheetParams = async (product) => {
    var raw = JSON.stringify(product)
    const response = await fetch(`${Config.STRIPE_API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: raw
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    setClientSecret(paymentIntent);
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams(product);

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });
    if (!error) {
      setLoading(false);
    } else {
      console.log('error', error)
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet({ clientSecret });
    if (error) {
      setAlertImage(failureIcon);
      setAlertText('Hubo un problem con tu órden. Favor de intentar mas tarde.');
      setAlertTitle('Error');
      setAlertVisible(true);
    } else {
      setAlertImage(successIcon);
      setAlertText('Tu orden ha sido confirmado!');
      setAlertTitle('Éxito');
      setAlertVisible(true);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <>
      <NamiquiButton
        loading={loading}
        style={{ marginTop: 50, marginBottom: 50 }}
        full
        text={<Text>Cobrar</Text>}
        onPress={openPaymentSheet}
      />
      <NamiquiAlert
        image={alertImage}
        title={alertTitle}
        message={alertText}
        closeModal={() => setAlertVisible(false)}
        visible={alertVisible}
        onDismiss={goHome}
        buttonText="OK"
      />
    </>
  );
}