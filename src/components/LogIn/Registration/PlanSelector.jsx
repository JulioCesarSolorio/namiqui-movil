import React, { useState } from 'react';
import {
  Switch,
  View,
  Image,
} from 'react-native';
import { Text } from 'native-base';
import styles from '../../../style';
import IconFree from '../../../assets/icons/Icon_Free.png';
import IconPro from '../../../assets/icons/Icon_Pro.png';
import IconPremium from '../../../assets/icons/Icon_Premium.png';
import { NamiquiTitle } from '../../styledComponents';

export default function PlanSelector(props) {
  const { onSubmit } = props;
  const [planSelection, setPlanSelection] = useState('free');

  function choosePlan(plan) {
    setPlanSelection(plan);
    onSubmit(plan);
  }

  return (
    <View>
      <NamiquiTitle text="2. Elige tu tipo de plan" />

      <View style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20,
      }}
      >
        <View style={styles.planContainer}>
          <Text>FREE</Text>
          <View style={{ ...styles.smileyContainer }}>
            <Image source={IconFree} style={styles.smiley} />
          </View>
          <Switch
            thumbColor="#fff"
            trackColor={{ true: '#E72945', false: '#2E3138' }}
            onValueChange={() => choosePlan('free')}
            value={true}
          />
        </View>
        <View style={styles.planContainer}>
          <Text>PRO</Text>
          <View style={{ ...styles.smileyContainer }}>
            <Image source={IconPro} style={styles.smiley} />
          </View>
          <Switch
            disabled
            thumbColor="#fff"
            trackColor={{ true: '#E72945', false: '#2E3138' }}
            onValueChange={() => choosePlan('pro')}
            value={planSelection === 'pro'}
          />
        </View>
        <View style={styles.planContainer}>
          <Text>PREMIUM</Text>
          <View style={{ ...styles.smileyContainer }}>
            <Image source={IconPremium} style={styles.smiley} />
          </View>
          <Switch
            disabled
            thumbColor="#fff"
            trackColor={{ true: '#E72945', false: '#2E3138' }}
            onValueChange={() => choosePlan('premium')}
            value={planSelection === 'premium'}
          />
        </View>
      </View>
    </View>
  );
}
