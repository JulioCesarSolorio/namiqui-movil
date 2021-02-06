import React from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../../style';

export default function StepIndicator({ activeNum }) {
  return (
    <View style={styles.stepIndicatorContainer}>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#302F2F', '#514C4C']} style={styles.stepIndicator}>
        <Text style={activeNum === 1 ? styles.selected : styles.darkText}>1</Text>
      </LinearGradient>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#302F2F', '#514C4C']} style={styles.stepIndicator}>
        <Text style={activeNum === 2 ? styles.selected : styles.darkText}>2</Text>
      </LinearGradient>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#302F2F', '#514C4C']} style={styles.stepIndicator}>
        <Text style={activeNum === 3 ? styles.selected : styles.darkText}>3</Text>
      </LinearGradient>
    </View>
  );
}
