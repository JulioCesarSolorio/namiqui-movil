import React, { useState, useRef, useEffect } from 'react';
import { Form, Text } from 'native-base';
import {
  View, Image, Modal, TouchableOpacity,
} from 'react-native';
import { useForm } from 'react-hook-form';
import close from '../../assets/icons/times.png';
import { PasswordRecoveryDigit, UserInputPassword } from '../elements/forms/formUserInputs';
import { NamiquiButton, NamiquiLogo } from '../styledComponents';

export default function PasswordRecoveryModal(props) {
  const {
    closeModal, visible, submitChangePassword, step, setStep, loading
  } = props;
  const {
    handleSubmit, watch, errors, control,
  } = useForm();
  const watchPassword = watch('password');
  const [fullCode, setFullCode] = useState([]);
  const refInput1 = useRef();
  const refInput3 = useRef();
  const refInput2 = useRef();
  const refInput4 = useRef();
  const refInput5 = useRef();

  function dismissModal() {
    setStep('enter code');
    setFullCode([]);
    closeModal();
  }

  function submitDigit(d, i, callback) {
    console.log('d is ', d);
    const newD = d.replace(/[^0-9]/g, '');
    setFullCode((code) => {
      const newCode = [...code];
      newCode[i] = newD;
      return newCode;
    });
    if (newD) {
      return callback();
    }
    return null;
  }

  function onSubmit(data) {
    const { password } = data;
    const fullData = { code: fullCode.join(''), newPassword: password };
    console.log('onSubmit fullData', fullData);
    submitChangePassword(fullData);
  }

  useEffect(() => {
    console.log('code entered: ', fullCode);
    if (fullCode[0] && fullCode[1] && fullCode[2] && fullCode[3] && fullCode[4] && fullCode[5]) {
      console.log('we have a full code');
      setStep('new password');
    } else {
      console.log('we DO NOT have a full code');
    }
  }, [fullCode, setStep]);

  return (
    <Modal
      visible={visible}
      transparent
      presentationStyle="overFullScreen"
    >
      <View
        style={{
          width: '90%',
          borderRadius: 25,
          backgroundColor: '#fff',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 'auto',
          marginBottom: 'auto',
          position: 'relative',
          padding: 15,
          paddingTop: 45,
        }}
      >
        <TouchableOpacity
          style={{
            height: 20,
            width: 20,
            marginTop: 5,
            marginBottom: 15,
            position: 'absolute',
            top: 10,
            right: 10,
          }}
          onPress={() => dismissModal()}
        >
          <Image
            source={close}
            style={{
              height: '100%', width: '100%', marginLeft: 'auto', marginRight: 'auto',
            }}
          />
        </TouchableOpacity>
        <NamiquiLogo />
        {step === 'enter code'
          ? (
            <View style={{ marginVertical: 25 }}>
              <Text
                style={{
                  color: '#000', fontSize: 24, textAlign: 'center', marginVertical: 25,
                }}
              >
                Te mandamos un correo con un código de recuperación. Ingresa el código aqui.
              </Text>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <PasswordRecoveryDigit
                  onEnterDigit={(d) => submitDigit(d, 0, () => refInput1.current.focus())}
                  value={fullCode[0]}
                  autoFocus
                />
                <PasswordRecoveryDigit
                  onEnterDigit={(d) => submitDigit(d, 1, () => refInput2.current.focus())}
                  value={fullCode[1]}
                  refInput={refInput1}
                />
                <PasswordRecoveryDigit
                  onEnterDigit={(d) => submitDigit(d, 2, () => refInput3.current.focus())}
                  value={fullCode[2]}
                  refInput={refInput2}
                />
                <PasswordRecoveryDigit
                  onEnterDigit={(d) => submitDigit(d, 3, () => refInput4.current.focus())}
                  value={fullCode[3]}
                  refInput={refInput3}
                />
                <PasswordRecoveryDigit
                  onEnterDigit={(d) => submitDigit(d, 4, () => refInput5.current.focus())}
                  value={fullCode[4]}
                  refInput={refInput4}
                />
                <PasswordRecoveryDigit
                  onEnterDigit={(d) => submitDigit(d, 5, () => undefined)}
                  value={fullCode[5]}
                  refInput={refInput5}
                />
              </View>
              <NamiquiButton
                text="Enviar"
                onPress={() => handleSubmit(onSubmit)}
                disabled
                style={{
                  marginVertical: 15,
                }}
                loading={loading}
              />
            </View>
          )
          : null}
        {step === 'new password'
          ? (
            <View style={{ marginTop: 25 }}>
              <Text
                style={{
                  color: '#000',
                  fontSize: 24,
                  textAlign: 'center',
                  marginVertical: 25,
                }}
              >
                Ingresa tu nueva contraseña.
              </Text>
              <Form style={{ minHeight: 200, display: 'flex', justifyContent: 'space-between' }}>
                <UserInputPassword
                  errors={errors}
                  control={control}
                  placeholder="Contraseña"
                  name="password"
                  bordered
                />
                <UserInputPassword
                  errors={errors}
                  control={control}
                  validate={{
                    function: (value) => value === watchPassword,
                    msj: 'La contraseña y su verificación deben de coincidir',
                  }}
                  placeholder="Verificar Contraseña"
                  name="password2"
                  bordered
                />
                <NamiquiButton
                  full
                  onPress={handleSubmit(onSubmit)}
                  text="Siguiente"
                  style={{
                    marginVertical: 15,
                  }}
                  loading={loading}
                />
              </Form>
            </View>
          )
          : null}
      </View>
    </Modal>
  );
}
