import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Container, Content, Form,
} from 'native-base';
import { NamiquiButton, NamiquiTitle } from '../../styledComponents';
import {
  UserInputName, UserAddressInputs, UserInputEmail, UserInputTelefono,
} from '../../elements/forms/formUserInputs';
import { checkIfEmailExists } from '../../../api/users';
import { InputGroupTitle } from '../../elements/forms/namiquiForm';

export default function PersonalInfoScreen({ navigation }) {
  const {
    control, handleSubmit, errors,
  } = useForm();

  function sendToPlanSelection(data) {
    console.log('Registerscreen - creatNewUser', data);
    navigation.navigate('Usuario NamiQui', { newUserInfo: data });
  }

  async function checkIfEmailIsUnique(email) {
    const result = await checkIfEmailExists(email);
    console.log('checkIfEmailIsUnique result', result);
    if (result.data) {
      return !result.data;
    }
    // llega aqui si hay error de conexión
    // deja pasar al siguiente paso, cuando backEnd manda respuesta al registro, marca error
    return true;
  }

  return (
    <Container>
      <Content padder>
        <NamiquiTitle
          text="1. Registra tus datos"
          style={{
            fontSize: 22, color: '#fff', marginLeft: 10,
          }}
        />
        <Form>
          <InputGroupTitle title="Datos Personales" />
          <UserInputName control={control} errors={errors} />
          <InputGroupTitle title="Domicilio" />
          <UserAddressInputs control={control} errors={errors} />
          <InputGroupTitle title="Contacto" />
          <UserInputEmail control={control} errors={errors} validation={checkIfEmailIsUnique} />
          <UserInputTelefono control={control} errors={errors} />

          <NamiquiButton
            style={{ marginTop: 50 }}
            full
            onPress={handleSubmit(sendToPlanSelection)}
            text="Siguiente"
          />
        </Form>
      </Content>
    </Container>
  );
}
