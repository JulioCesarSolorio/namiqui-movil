import React from 'react';
import { View, Image } from 'react-native';
import {
  Text, Badge,
} from 'native-base';
import { colors } from '../../../style';
import userImage from '../../../assets/icons/avatars/User.png'

export function getNamiUserImg(user) {
  return (!user.user_image_url) ? userImage : { uri: user.user_image_url };
}

export function NamiUserImg(props) {
  const imgSize = (props.imgSize) ? props.imgSize : 80;

  return (
    <View style={{
      marginRight: 20,
      backgroundColor: 'white',
      width: imgSize,
      height: imgSize,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: (imgSize) / 2,
    }}
    >
      <Image
        source={getNamiUserImg(props.user)}
        style={{
          width: imgSize,
          height: imgSize,
        }}
      />
    </View>
  );
}

export default function NamiUserLabel(props) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}
    >
      <NamiUserImg imgSize={props.imgSize} user={props.user} />
      <View style={{
        marginVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <View>
          <Text>{props.user.username}</Text>
          <Text>{props.user.name}</Text>
          {(props.userRol)
            && <Text style={{ fontSize: 12 }}>{props.userRol}</Text>}
        </View>
      </View>
    </View>
  );
}

//= ============================================  NAMIUSERS DEL USUARIO =============================================

export function getNamiusersUsernameInText(user, options = {}) {
  let namiusers = '';

  if (options.textDefault) {
    namiusers = options.textDefault;
  }

  if (user.namiusers) {
    namiusers = '';
    Object.keys(user.namiusers).forEach((k, index) => {
      namiusers += user.namiusers[k].username;
      if (index < user.namiusers.length - 1) {
        namiusers += ', ';
      }
    });
  }

  return namiusers;
}

export function NamiusersLabels(props) {
  if (props.user && props.user.namiusers) {
    return (
      <View>
        {Object.keys(props.user.namiusers).map((k) => (
          <View
            key={k}
            style={{
              flexDirection: 'row',
            }}
          >
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 2,
            }}
            >
              <Badge style={{ width: 27 }}>
                <Text>{parseInt(k, 10) + 1}</Text>
              </Badge>
            </View>
            <View style={{
              flex: 9,
            }}
            >
              {NamiUserLabel({ user: props.user.namiusers[k] })}
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View>
      <Text style={{
        color: colors.COLOR_SELECTED,
        fontSize: 18,
        paddingVertical: 8,
      }}
      >
        Actualmente no cuentas con ningún NamiUser
      </Text>
    </View>
  );
}
