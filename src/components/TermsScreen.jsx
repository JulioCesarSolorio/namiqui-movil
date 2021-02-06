import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { NamiquiButton } from './styledComponents';
import LogoGrey from '../assets/images/Namiqui_Grey.png';
import { getTermsAndConditions } from '../api/assets';

export default function TermsScreen({ route, navigation }) {
  const [terms, setTerms] = useState('');

  useEffect(() => {
    const handleGetTerms = async () => {
      const termsObject = await getTermsAndConditions();
      const formatedTerms = termsObject.data.contract.replace(/\r?\n|\t|\r/g, '').replace(/\s+/g, ' ');
      setTerms(formatedTerms);
    };
    handleGetTerms();
  }, []);

  function handleAcceptTerms() {
    navigation.navigate('Usuario NamiQui', { acceptsTerms: true });
  }
  return (
    <Container>
      <Content style={{ padding: 20 }}>
        <View style={{
          height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        >
          <Image source={LogoGrey} style={{ height: '40%', resizeMode: 'contain' }} />
        </View>
        <Text>
          {terms}
        </Text>

        <NamiquiButton style={{ marginTop: 50, marginBottom: 50 }} full text="Acepto" onPress={handleAcceptTerms} />

      </Content>
    </Container>
  );
}
