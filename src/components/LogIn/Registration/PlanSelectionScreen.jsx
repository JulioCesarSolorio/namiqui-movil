import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Container, Content, Text,
} from 'native-base';
import PlanSelectionForm from './PlanSelectionForm';
import PlanSelector from './PlanSelector';
import { createNewUser } from '../logInUtils';
import { NamiquiAlert } from '../../styledComponents';
import failureIcon from '../../../assets/icons/alerta_2.png';

export default function PlanSelectionScreen({ route, navigation }) {
  const { newUserInfo } = route.params;
  console.log('Plan selection recevied newUserInfo: ', newUserInfo);
  const dispatch = useDispatch();
  const [planChoice, setPlanChoice] = useState('free');
  // const [showInputs, setShowInputs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Alerta');
  const [alertImage, setAlertImage] = useState(failureIcon);
  const [alertText, setAlertText] = useState('Una alerta genérica');
  const [alertOnDismiss, setAlertOnDismiss] = useState(undefined);

  useEffect(() => {
    if (route && route.params && route.params.acceptsTerms) {
      setAcceptsTerms(true);
    }
  }, [route]);

  function closeAlert() {
    setAlertVisible(false);
  }

  function choosePlan(plan) {
    setPlanChoice(plan);
    // setShowInputs(true);
  }

  function goToPaymentDetails(data) {
    navigation.navigate('Datos de pago', { data: { ...newUserInfo, ...data, plan: planChoice } });
  }

  function goToTerms() {
    navigation.navigate('Términos y Condiciones');
  }

  function goToQueEsUnNamiUser() {
    navigation.navigate('¿Que Es Un NamiUser?');
  }

  function onSubmit(data) {
    const setAlertFunctions = {
      setAlertVisible,
      setAlertTitle,
      setAlertImage,
      setAlertText,
      setAlertOnDismiss,
    };
    console.log('submitted registry');
    setLoading(true);
    createNewUser({
      data: { ...newUserInfo, ...data, plan: planChoice },
      dispatch,
      setAlertFunctions,
      setLoading,
      navigation,
    })
      .then(() => {
        setLoading(false);
      });
  }

  function handleSubmit(data) {
    if (planChoice === null || planChoice === 'empty') {
      setPlanChoice('empty');
    } else if (planChoice === 'free') {
      onSubmit(data);
    } else {
      goToPaymentDetails(data);
    }
  }

  return (
    <Container>
      <Content padder>
        <PlanSelector onSubmit={choosePlan} />
        {planChoice === 'empty' ? <Text style={{ marginLeft: 15 }}>Por favor, escoge un plan.</Text> : null}
        <PlanSelectionForm
          acceptsTerms={acceptsTerms}
          loading={loading}
          onSubmit={handleSubmit}
          goToTerms={goToTerms}
          goToQueEsUnNamiUser={goToQueEsUnNamiUser}
        />
        <NamiquiAlert
          visible={alertVisible}
          message={alertText}
          image={alertImage}
          title={alertTitle}
          closeModal={closeAlert}
          onDismiss={alertOnDismiss}
        />
      </Content>
    </Container>
  );
}
