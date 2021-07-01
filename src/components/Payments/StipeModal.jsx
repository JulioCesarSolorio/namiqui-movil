import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { Modal, View } from 'react-native';
import { Text } from 'native-base';
import CheckoutButton from './CheckoutButton';
import { NamiquiButton } from '../styledComponents';


export default function StripeModal(props) {
  const {
    closeModal, visible, onDismiss, product, navigation
  } = props;
  // assume product looks like {item: 'Namiqui Pro', amount: 125, type: 'subscription'}



  function dismissModal() {
    closeModal();
    if (onDismiss) {
      onDismiss();
    }
  }

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
        <Text style={{ fontSize: 20, textAlign: 'center', color: 'black' }}>Producto: {product.item} / ${product.amount}</Text>
        <CheckoutButton navigation={navigation} closeParentModal={closeModal} product={product}/>
        <NamiquiButton style={{ marginTop: 50, marginBottom: 50 }} full text="Cancel" onPress={dismissModal} />
      </View>
    </Modal>
  );
}