import React from 'react';
import { Image, View } from 'react-native';
 
export default function RewardItemImage(props) {
        return (
          <View style={{ height: 80, width: 80, margin: 20 }}>
            <Image
              source={props.source}
              style={{
                width: 80,
                height: 80,
              }}
            />
          </View>)
      };
