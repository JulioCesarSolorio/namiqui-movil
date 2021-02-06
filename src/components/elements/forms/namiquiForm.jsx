import { View, Switch } from 'react-native';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Text, Picker } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NamiquiInput } from '../../styledComponents';
import style, { colors } from '../../../style';

function showValidationErrors(props) {
  const errors = [];
  // existe un error
  if (props.errors[props.name]) {
    console.log('validaion error');
    switch (props.errors[props.name].type) {
      case 'maxLength':
        errors.push(`El valor ingresado es demasiado largo. (Máximo ${props.rules.maxLength} caracteres)`);
        break;
      case 'minLength':
        errors.push(`El valor ingresado es demasiado corto. (Mínimo ${props.rules.minLength} caracteres)`);
        break;
      case 'required':
        errors.push('Este es un campo obligatorio.');
        break;
      case 'pattern':
        errors.push((props.rules.patternErrorMsj) ? props.rules.patternErrorMsj : 'No es un formato válido.');
        break;
      case 'validate':
        errors.push((props.rules.validationErrorMsj) ? props.rules.validationErrorMsj : 'El valor ingresado no es valido.');
        break;

      default:
        errors.push('Hay un problema con este campo.');
        break;
    }
  }

  if (errors.length) {
    let msj = '';

    Object.keys(errors)
      .forEach((k) => {
        msj += `${errors[k]} `;
      });

    return (<Text style={style.textSmallDanger}>{msj}</Text>);
  }

  return (<View />);
}

export function Input(props) {
  return (
    <View>
      <Controller
        control={props.control}
        render={({ onChange, onBlur, value }) => (
          <NamiquiInput
            secureTextEntry={!!props.secureTextEntry}
            onBlur={onBlur}
            onChangeText={(newValue) => onChange(
              (props.trim) ? newValue.trim() : newValue,
            )}
            value={value}
            placeholder={props.placeholder}
            iconComponent={props.iconComponent}
            bordered={props.bordered}
          />
        )}
        name={props.name}
        rules={props.rules}
        defaultValue={props.defaultValue || ''}
      />
      {showValidationErrors(props)}
    </View>
  );
}

export function SwitchAction(props) {
  return (
    <View style={{
      flexDirection: 'row',
      marginVertical: (props.margin) ? props.margin : 10,
      flex: 8,
    }}
    >
      <View style={{
        flex: 6,
      }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{props.name}</Text>
      </View>
      <View style={{
        flex: 2,
      }}
      >
        <Switch
          trackColor={{ false: 'white', true: colors.COLOR_SELECTED }}
          thumbColor="white"
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            props.onPress();
          }}
          value={props.enabled}
        />
      </View>
    </View>
  );
}

export function Select(props) {
  return (
    <View>
      <View style={{
        backgroundColor: 'white',
        color: colors.COLOR_TEXT_BLACK_DEFAULT,
        borderRadius: 8,
        marginTop: 8,
      }}
      >
        <Controller
          control={props.control}
          render={({ onChange, onBlur, value }) => (
            <Picker
              note
              mode="dropdown"
              style={{
                width: undefined,
                // color: colors.COLOR_TEXT_BLACK_DEFAULT,
              }}
              headerStyle={{ backgroundColor: colors.COLOR_BACKGROUND_GRAY_STRONG }}
              headerTitleStyle={{ color: '#fff', fontFamily: 'Kollektif' }}
              headerBackButtonText="Regresar"
              headerBackButtonTextStyle={{ color: colors.COLOR_DANGER }}
              placeholderIconColor="#666"
              placeholderStyle={{ color: '#666', width: '90%', fontFamily: 'Kollektif' }}
              textStyle={{ color: '#000', width: '90%', fontFamily: 'Kollektif' }}
              iosIcon={<Icon name="caret-down" color="grey" size={30} />}
              iosHeader="Estado"
              placeholder="Seleccionar tu estado"
              selectedValue={value}
              onValueChange={(value) => {
                onChange(value);
              }}
            >
              <Picker.Item label="Selecciona uno" value={undefined} />
              {Object.keys(props.options).map((k) => (
                <Picker.Item key={k} label={props.options[k].name} value={props.options[k].value} />
              ))}
            </Picker>
          )}
          name={props.name}
          rules={props.rules}
          defaultValue={props.defaultValue || ''}
        />
      </View>
      {showValidationErrors(props)}
    </View>
  );
}

export function InputGroupTitle(props) {
  return (
    <View style={{
      marginBottom: 10,
    }}
    >
      <Text style={{
        fontSize: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.COLOR_SELECTED,
        paddingVertical: 12,
      }}
      >
        {props.title}
      </Text>
    </View>
  );
}

/*

*/
