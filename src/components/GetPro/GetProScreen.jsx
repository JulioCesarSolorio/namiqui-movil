import { Container, Content } from 'native-base';
import React from 'react';
import { useSelector } from 'react-redux';
import HelpButtonIOS from '../Help/HelpButton/HelpButtonIOS';
import { NamiquiLogo, NamiquiTitle } from '../styledComponents';

export default function GetProScreen({ navigation }) {
  const showingIOSButton = useSelector((state) => state.userReducers.showIOSButton);
  return (
    <Container style={{ flexGrow: 1 }}>
      <Content>
        <NamiquiTitle text="¡Próximamente!" />
        <NamiquiLogo />
      </Content>
      <HelpButtonIOS navigation={navigation} showing={showingIOSButton} />
    </Container>
  );
}
