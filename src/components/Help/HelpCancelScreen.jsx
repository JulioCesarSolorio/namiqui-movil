import React from 'react';
import {
  Container, Content, Text,
} from 'native-base';
import { View, TouchableOpacity } from 'react-native';
import { NamiquiButton } from '../styledComponents';
import { useFocusEffect } from '@react-navigation/native';

export default function HelpCancelScreen({ navigation, route }) {

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                navigation.pop();
            };
        })
    );

  return (
    <Container>
      <Content contentContainerStyle={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}
      >
        <View style={{
          padding: 20,
          marginTop: -30,
        }}
        >
          <View style={{
            marginBottom: 20,
          }}
          >
            <Text style={{
              fontSize: 38,
              textAlign: 'center',
            }}
            >
              Has cancelado la alerta
            </Text>
          </View>
          <View style={{
            marginBottom: 50,
          }}
          >
            <Text style={{
              textAlign: 'center',
              fontSize: 12,
            }}
            >
              {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry.  */}
            </Text>
          </View>
          <View style={{

          }}
          >
            <NamiquiButton
              full
              style={{ margin: 10 }}
              onPress={() => {
                navigation.navigate('Mapa Delictivo');
              }}
              text="Volver al Inicio"
            />

            <View style={{
              marginTop: 30,
            }}
            >
              <TouchableOpacity onPress={() => {
                navigation.navigate('Pedir Ayuda');
              }}
              >
                <Text style={{ textAlign: 'center', textDecorationLine: 'underline' }}>Volver a enviar la alerta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Content>
    </Container>
  );
}
