import React from 'react';
import { TextInput, View } from 'react-native';
import {
  regExPhone, regExEmail, regExSpacesAndLetters, regExUsername, regExDigit, regExCP,
} from '../../../constants/regEx';
import { Input, Select } from './namiquiForm';
import { checkIfUserExists } from '../../../api/namiquiUsers';
import style from '../../../style';
import { estados } from '../../../api/map';

//= ===========================  NAMIQUI USER INPUTS ===============================
export function UserInputNamiquiUser(props) {
  // se tiene que instanciar localemnte la funcion para usarla en validate:
  const { username } = props;
  return (
    <Input
      control={props.control}
      errors={props.errors}
      name={props.name}
      placeholder={props.placeholder}
      trim
      rules={{
        // Validator should check DataBase for users with this name
        validate: (value) => (username ? checkIfUserExists(value) && (value !== username) : checkIfUserExists(value)),
        required: true,
        validationErrorMsj: username ? 'No se puede usar ese usario como NamiUser' : 'El NamiUser no existe en el sistema.',
      }}
      defaultValue={props.defaultValue || undefined}
      iconComponent={props.iconComponent}
    />
  );
}

export function UserInputNamiquiUsers(props) {
  const { username } = props;
  const NamiUsersInputs = [];
  // 2 numero de namiusers del usuario
  for (let i = 0; i < props.namiusersNum; i += 1) {
    NamiUsersInputs.push(
      <View key={i}>
        {
          UserInputNamiquiUser({
            control: props.control,
            errors: props.errors,
            name: `namiUser${i + 1}`,
            placeholder: `Namiqui${i + 1}`,
            username,
          })
        }
      </View>,

    );
  }

  if (NamiUsersInputs.length) {
    return NamiUsersInputs;
  }

  return <View />;
}

export function UserInputName(props) {
  return (
    <Input
      control={props.control}
      errors={props.errors}
      name="name"
      placeholder="Nombre"
      iconComponent={props.iconComponent}
      rules={{
        required: true,
        minLength: 2,
        maxLength: 60,
        validate: (value) => regExSpacesAndLetters.test(value),
        validationErrorMsj: 'No se aceptan caracteres especiales.',
      }}
    />
  );
}
/*
Nombre de usuario
Ejemplo: juan12, mariadb
*/
export function UserInputUsername(props) {
  return (
    <Input
      control={props.control}
      errors={props.errors}
      name="username"
      placeholder="Nombre de usuario"
      trim
      iconComponent={props.iconComponent}
      rules={{
        // eslint-disable-next-line no-useless-escape
        validate: props.validation ? (value) => props.validation(value) : undefined,
        validationErrorMsj: 'El nombre de usuario ya está registrado',
        pattern: regExUsername,
        patternErrorMsj: 'El nombre de usuario solo puede contener letras, números, _ y -',
        required: true,
        maxLength: 20,
      }}
    />
  );
}

//= ============================= OTROS INPUTS DEL USUARIO =============================

export function UserAddressInputs(props) {
  return (
    <View>
      <Select
        name="address_state_id"
        control={props.control}
        errors={props.errors}
        rules={{
          required: true,
        }}
        options={estados}
      />
      <Input
        control={props.control}
        errors={props.errors}
        name="address_city"
        placeholder="Localidad / Cuidad"
        rules={{
          required: true,
          maxLength: 255,
        }}
      />
      <Input
        control={props.control}
        errors={props.errors}
        name="address_colony"
        placeholder="Colonia"
        rules={{
          maxLength: 255,
        }}
      />
      <Input
        control={props.control}
        errors={props.errors}
        name="address"
        placeholder="Domicilio (Calle y Numero)"
        rules={{
          required: true,
          maxLength: 255,
        }}
      />
      <View style={{
        width: 150,
      }}
      >
        <Input
          control={props.control}
          errors={props.errors}
          name="address_cp"
          placeholder="CP"
          rules={{
            required: true,
            pattern: regExCP,
            patternErrorMsj: 'Por favor ingresa un número de 5 dígitos.',
          }}
        />
      </View>

    </View>

  );
}

export function UserInputEmail(props) {
  return (
    <Input
      control={props.control}
      errors={props.errors}
      name="email"
      placeholder="Correo electrónico"
      trim
      iconComponent={props.iconComponent}
      rules={{
        required: true,
        pattern: regExEmail,
        validate: props.validation ? (value) => props.validation(value) : undefined,
        validationErrorMsj: 'Este correo ya esta registrado.',
      }}
    />
  );
}

export function UserInputTelefono(props) {
  return (
    <Input
      control={props.control}
      errors={props.errors}
      name="phone"
      placeholder="Teléfono"
      trim
      iconComponent={props.iconComponent}
      rules={{
        required: true,
        pattern: regExPhone,
        validationErrorMsj: 'Por favor ingresa un número de telefono de 10 dígitos.',
      }}
    />
  );
}

//= ================================ PASSWORD =================================

export function UserInputPassword(props) {
  // validaciones por default del password
  const rules = {
    required: true,
    minLength: 6,
    maxLength: 20,
    validate: (value) => regExUsername.test(value),
    validationErrorMsj: 'Sólo se aceptan letras, números y !?._- en contraseña',
  };

  // validacion de que las 2 contraseñas coincidan
  if (props.validate) {
    rules.validate = props.validate.function;
    rules.validationErrorMsj = props.validate.msj;
  }

  return (
    <Input
      secureTextEntry
      control={props.control}
      errors={props.errors}
      name={props.name}
      placeholder={props.placeholder}
      trim
      iconComponent={props.iconComponent}
      rules={rules}
      bordered={props.bordered}
    />
  );
}

//= ================================ PASSWORD RECOVERY =================================

export function PasswordRecoveryDigit(props) {
  const {
    name, onEnterDigit, autoFocus, refInput, value,
  } = props;

  return (
    <TextInput
      style={{
        ...style.props, borderWidth: 1, borderColor: '#000', borderStyle: 'solid', width: 40, minHeight: 40,
      }}
      name={name}
      placeholder="#"
      maxLength={1}
      minLength={1}
      value={value}
      keyboardType="number-pad"
      onChangeText={(text) => onEnterDigit(text)}
      autoFocus={autoFocus}
      ref={refInput}
      iconComponent={props.iconComponent}
    />
  );
}
