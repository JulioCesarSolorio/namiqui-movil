import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import CheckBox from '@react-native-community/checkbox';
import {
  Form, CardItem, View, Text,
} from 'native-base';
import { Pressable } from 'react-native';
import { NamiquiButton, NamiquiInputIcon, NamiquiTitle } from '../../styledComponents';
import { UserInputNamiquiUser, UserInputUsername, UserInputPassword } from '../../elements/forms/formUserInputs';
import { checkIfUserExists } from '../../../api/namiquiUsers';
import IconInfo from '../../../assets/icons/Icon_Info.png';

export default function PlanSelectionForm(props) {
  const {
    onSubmit, goToTerms, goToQueEsUnNamiUser, loading, acceptsTerms
  } = props;
  const {
    control, handleSubmit, errors, watch, setValue,
  } = useForm();
  const watchPassword = watch('password');

  useEffect(() => setValue('terms', acceptsTerms), [acceptsTerms, setValue]);
  // function handleSetAcceptsTerms(newValue) {
  //   console.log('handling setAcceptsTerms', newValue);
  //   setValue('terms', newValue);
  // }

  async function checkIfUserIsUnique(username) {
    const result = await checkIfUserExists(username);
    console.log('checkIfUserExists result', !result);
    return !result;
  }

  function NamiUserLinkIcon() {
    return (
      <Pressable
        style={{
          height: 40, width: 40, display: 'flex', justifyContent: 'center',
        }}
        onPress={goToQueEsUnNamiUser}
      >
        <NamiquiInputIcon source={IconInfo} />
      </Pressable>
    );
  }

  return (
    <View style={{ marginTop: 40 }}>
      <NamiquiTitle
        style={{
          fontSize: 22, color: '#fff', marginLeft: 10,
        }}
        text="3. Elige tu usuario NamiQui"
      />
      <Form style={{ marginTop: 20 }}>
        <UserInputUsername
          control={control}
          errors={errors}
          validation={checkIfUserIsUnique}
        />
        <UserInputPassword
          errors={errors}
          control={control}
          placeholder="Contraseña"
          name="password"
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
        />
        <UserInputNamiquiUser
          control={control}
          errors={errors}
          name="namiUser1"
          placeholder="NamiUser1"
          defaultValue="Namiqui1"
          iconComponent={<NamiUserLinkIcon />}
        />
        <UserInputNamiquiUser
          control={control}
          errors={errors}
          name="namiUser2"
          placeholder="NamiUser2"
          defaultValue="Namiqui2"
          iconComponent={<NamiUserLinkIcon />}
        />
        <NamiquiButton
          full
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: 50, marginBottom: 20 }}
          text="Siguiente"
          loading={loading}
        />
        {errors.terms && errors.terms.type === 'required' && <CardItem><Text>Se debe aceptar los términos y condiciones</Text></CardItem>}
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Controller
            control={control}
            render={({ onChange, value }) => (
              <CheckBox
                disabled={false}
                value={value}
                onValueChange={(newValue) => {
                  console.log('checkbox change', newValue);
                  onChange(newValue);
                }}
                tintColors={{ true: '#E72945', false: 'white' }}
              />
            )}
            name="terms"
            rules={{
              required: true,
            }}
            defaultValue=""
          />
          <Pressable onPress={() => goToTerms()}>
            <Text style={{ textDecorationLine: 'underline', marginLeft: 5 }}>Acepto Términos y Condiciones</Text>
          </Pressable>
        </View>
      </Form>
    </View>
  );
}
