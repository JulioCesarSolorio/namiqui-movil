import React, { useState } from 'react';
import { Container, Content, Form, Text } from 'native-base';
import { NamiquiButton, NamiquiTitle, NamiquiInput, NamiquiAlert, NamiquiLoadingOverlay } from '../styledComponents';
import { Alert, View } from 'react-native';
import RewardItemImage from './RewardItemImage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import successIcon from '../../assets/icons/Icon_Verificacion.png';
import failureIcon from '../../assets/icons/alerta_2.png';
import { colors } from '../../style';
import ErrorText from '../elements/forms/ErrorText';

export default function VerifyClaim({ navigation, route }) {
  const { params } = route;
  const { claim, reward } = params;
  const { claimId, images: claimImages, date, address: claimAddress } = claim;
  const { name, description, images: rewardImages, address, amount } = reward;
  const [loading, setLoading] = useState(false);
  const [alertDataRecognize, setAlertDataRecognize] = useState({
    image: successIcon,
    title: "¿Aceptas el cargo?",
    message: "RECONOCES TU BIEN EXTRAVIADO COMO DE TU PROPIEDAD, ACEPTAS  EL CARGO A TU TARJETA Y QUIERES PROCEDER A UNA COMUNICACIÓN CON EL NAMIUSER LOCALIZADOR?",
    visible: false
  })
  const [alertDataCharge, setAlertDataCharge] = useState({
    image: successIcon,
    title: "¡Éxito!",
    message: "SE TE HA REALIZADO UN CARGO DE $1,000.00 A TU TARJETA REGISTRADA ",
    visible: false
  })

  //  Estos numeros deben venir del back para mejor seguridad
  const rewardAmount = Number.parseInt(amount)
  const commission = rewardAmount / 10;
  const taxes = rewardAmount / 100 * 18;
  const finalReward = rewardAmount - commission - taxes;
  console.log('claim', claim);

  function handleRecognizeGood() {
    console.log('you recognized the good!')
    setAlertDataRecognize(data => ({ ...data, visible: true }))

  }

  function handleAcceptCharges() {
    let success = true
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);

    // send Data to back to make the charge
    // on API response, set loadingOverlay off 
    // remove !loading bits from below
    if (success && !loading) {
      setAlertDataCharge(data => ({ ...data, visible: true }))
    } else if (!loading) {
      setAlertDataCharge(() => ({ image: failure, title: "Error", message: 'Lo siento, hubo un problema. Favor de intentar de nuevo', visible: true }))
    }
  }

  function closeAlertRecognize() {
    setAlertDataRecognize(data => ({ ...data, visible: false }))
  }

  function closeAlertCharge() {
    setAlertDataCharge(data => ({ ...data, visible: false }))
  }

  function handleSeeFullClaim() {
    // navigate to claim view
    console.log('going to claim view');
    navigation.navigate('Claim Detail', { claim });
  }

  function goToGetMoreInfo() {
    navigation.navigate('Get More Info');
  }

  return (
    <Container style={{ flexGrow: 1, position: 'relative' }}>
      <Content style={{ paddingHorizontal: 20 }}>

        <NamiquiTitle text="Verificación de Reclamo" />
        <Text style={{ marginVertical: 10 }}>Bien encontrado: {name}</Text>
        <Text style={{ marginVertical: 10 }}>Descripción del bien: {description}</Text>
        {date && <Text style={{ marginVertical: 10 }}>Fecha y hora encontrado: {date}</Text>}
        <Text style={{ marginVertical: 10 }}>Fotos enviados por el NamiUser</Text>
        {claimImages && (
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', margin: 10 }}>
            {claimImages.map((image, i) => <RewardItemImage source={{ uri: image }} key={`${claimId}-${i}`} />)}
          </View>
        )}
        {address && (<Text style={{ marginVertical: 10 }}>Dirección de extravio: {address}</Text>)}
        {amount && (
          <>
            <Text>Monto de recompensa: ${amount}</Text>
            <Text>Comisión: ${commission}</Text>
            <Text>Impuestos: ${taxes}</Text>
            <Text style={{ marginVertical: 10 }}>Total Final a depositar al Namiuser Localizador de la Alerta de Recomensa: ${finalReward}</Text>
          </>
        )}
        <NamiquiButton
          text="Reconozco mi bien"
          onPress={handleRecognizeGood}
          style={{marginVertical: 20}}
        />
        <NamiquiButton
        text="Solicitar más información"
        onPress={goToGetMoreInfo}
        />
        <NamiquiAlert image={alertDataRecognize?.image} title={alertDataRecognize?.title} message={alertDataRecognize?.message} closeModal={closeAlertRecognize} visible={alertDataRecognize?.visible} onDismiss={handleAcceptCharges} />
        <NamiquiAlert image={alertDataCharge?.image} title={alertDataCharge?.title} message={alertDataCharge?.message} closeModal={closeAlertCharge} visible={alertDataCharge?.visible} onDismiss={handleSeeFullClaim} />

      </Content>
      {loading && <NamiquiLoadingOverlay loading={loading} />}

    </Container>
  );
}
