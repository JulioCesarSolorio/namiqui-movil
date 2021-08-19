import React from 'react';
import { Text } from 'native-base';
import { colors } from '../../../style';

export default function ErrorText(props) {
    return (
      <Text style={{ fontSize: 12, color: colors.COLOR_DANGER, marginVertical: 5 }}>{props.children}</Text>
    )
  }