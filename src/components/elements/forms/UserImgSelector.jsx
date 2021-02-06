import React, { useState } from 'react';
import {
  View, ActivityIndicator, Modal, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { Text } from 'native-base';
import { Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { NamiUserImg } from '../users/NamiUserLabel';
import { colors } from '../../../style';
import { NamiquiButton } from '../../styledComponents';
import { getAvatarList } from '../../../api/assets';
import { silentRefreshJWT } from '../../LogIn/logInUtils';

export default function UserImgSelector(props) {
  const [userImg, setUserImg] = useState({
    app_user_avatar_id: (props.user.avatar) ? props.user.avatar.id : 0,
    user_image_url: props.user.user_image_url,
  });
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [avatarList, setAvatarList] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userReducers.JWT);
  const expirationDate = useSelector((state) => state.userReducers.JWTExpiration);
  const refreshToken = useSelector((state) => state.userReducers.refreshToken);

  function loadAvatarList() {
    if (!avatarList.length) {
      silentRefreshJWT(refreshToken, dispatch, expirationDate)
        .then(() => {
          getAvatarList(token).then((response) => {
            console.log(response);
            if (!response.error) {
              setAvatarList(response.data);
            } else {
              console.log(response.error);
            }
          }).catch((error) => {
            console.log(error);
          });
        });
    }
  }

  return (
    <View>
      <Controller
        control={props.control}
        name="userImage"
        defaultValue={props.defaultValue || 1}
      />
      <Controller
        control={props.control}
        name="user_image_url"
        defaultValue=""
      />
      <View style={{
        flexDirection: 'row',
        marginVertical: 20,
      }}
      >
        <View>
          <NamiUserImg user={userImg} imgSize={60} />
        </View>
        <View style={{
          justifyContent: 'center',
        }}
        >
          <NamiquiButton
            textStyle={{
              fontSize: 12,
            }}
            text="Selecciona tu Avatar"
            style={{ width: 150 }}
            onPress={() => {
              setSelectorOpen(true);
            }}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        visible={selectorOpen}
        transparent
        onShow={loadAvatarList}
      >
        <View style={{
          flex: 1,
          padding: 20,
          paddingHorizontal: 10,
          backgroundColor: colors.COLOR_BACKGROUND_GRAY_STRONG,
          position: 'relative',
        }}
        >
          <View style={{
            padding: 10,
            borderBottomColor: colors.COLOR_SELECTED,
            borderBottomWidth: 1,
          }}
          >
            <Text style={{
              textAlign: 'center',
              fontSize: 24,
            }}
            >
              Selecciona tu Avatar
            </Text>
          </View>

          {(avatarList.length)
            ? (
              <ScrollView>
                <View style={{
                  flexDirection: 'row',
                  flex: 1,
                  flexWrap: 'wrap',
                  width: '100%',
                }}
                >
                  {Object.keys(avatarList).map((k) => (
                    <View
                      key={k}
                      style={{
                        width: '33.3%',
                        padding: 10,
                        backgroundColor: (userImg.app_user_avatar_id === avatarList[k].id) ? colors.COLOR_SELECTED : null,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TouchableOpacity onPress={() => {
                        setUserImg({
                          app_user_avatar_id: avatarList[k].id,
                          user_image_url: avatarList[k].image_url,
                        });
                      }}
                      >
                        <Image
                          source={{
                            uri: avatarList[k].image_url,
                          }}
                          style={{
                            height: 90,
                            width: 90,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )

            : (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}
              >
                <ActivityIndicator size={50} color={colors.COLOR_SELECTED} />
              </View>
            )}

          <View style={{
            paddingTop: 10,
          }}
          >
            <NamiquiButton
              text="Aceptar"
              onPress={() => {
                setSelectorOpen(false);
                props.onSelectImage(userImg);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
