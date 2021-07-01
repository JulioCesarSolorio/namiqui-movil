import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Content } from 'native-base';
import HelpButtonIOS from '../Help/HelpButton/HelpButtonIOS';
import { NamiquiLogo, NamiquiTitle, NamiquiButton } from '../styledComponents';
import StripeModal from '../Payments/StipeModal';

export default function GetProScreen({ navigation }) {
  const showingIOSButton = useSelector((state) => state.userReducers.showIOSButton);
  const [modalVisible, setModalVisible] = useState(false);
  // set product with a test product for testing
  // remove for production
  const [product, setProduct] = useState({ item: 'Namiqui Pro', amount: 125, type: 'subscription' });
  console.log('product', product);


  function handleCloseModal() {
    setModalVisible(false);
  }

  function handlePressGetPro() {
    setModalVisible(true);
  }

  return (
    <Container style={{ flexGrow: 1 }}>
      <Content>
        <NamiquiTitle text="¡Próximamente!" />
        <NamiquiLogo />
        <NamiquiButton text="Obtén Namiqui Pro" onPress={handlePressGetPro} />
        {product && <StripeModal navigation={navigation} closeModal={handleCloseModal} visible={modalVisible} product={product} />}
      </Content>
      <HelpButtonIOS navigation={navigation} showing={showingIOSButton} />
    </Container>
  );
}
