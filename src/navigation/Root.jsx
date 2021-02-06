import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector, useStore } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { updateFCMToken } from '../api/users';
import { silentRefreshJWT } from '../components/LogIn/logInUtils';
import { storeNotification } from '../actions';
import UnauthorizedStack from './UnauthorizedStack';
import AuthorizedDrawer from './AuthorizedDrawer';
import NotificationStack from './NotificationStack';

export default function Root(props) {
  const { setLoading } = props;
  const [initialRoute] = useState('AuthLoading');
  const JWT = useSelector((state) => state.userReducers.JWT);
  const notification = useSelector((state) => state.userReducers.notification);
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();
  const store = useStore();

  const namHandleAppStateChange = useCallback((nextAppState) => {
    const currentStore = store.getState();
    const currentRefreshToken = currentStore.userReducers.refreshToken;
    const currentExpiration = currentStore.userReducers.JWTExpiration;

    // console.log('current store', currentStore);
    if (
      appState.current.match(/inactive|background/)
      && nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      silentRefreshJWT(currentRefreshToken, dispatch, currentExpiration);
    }
    appState.current = nextAppState;
  }, [dispatch, store]);

  // Update JWT when app is brought to foreground
  useEffect(() => {
    AppState.addEventListener('change', namHandleAppStateChange);

    return () => {
      AppState.removeEventListener('change', namHandleAppStateChange);
    };
  }, [namHandleAppStateChange]);

  // Send JCM token updates to Back End
  useEffect(() => {
    if (JWT) {
      const currentStore = store.getState();
      const { username } = currentStore.userReducers.user;
      messaging()
        .getToken()
        .then((token) => {
          console.log('FCM token', token);
          updateFCMToken(username, token, JWT);
        });
    }
  }, [JWT, store]);

  // Listen to whether the token changes
  useEffect(() => {
    if (JWT) {
      const currentStore = store.getState();
      const { username } = currentStore.userReducers.user;
      messaging().onTokenRefresh((newToken) => {
        console.log('sending new FCM token to Back');
        updateFCMToken(username, newToken, JWT);
      });
    }
  });

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging()
      .getToken()
      .then((token) => console.log('FCM token', token));

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      dispatch(storeNotification(remoteMessage));
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          dispatch(storeNotification(remoteMessage));
        }
        setLoading(false);
      });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('seeting notification as ', remoteMessage.notification);
      dispatch(storeNotification(remoteMessage));
    });
    return unsubscribe;
  }, [dispatch, setLoading]);

  function getNavigation() {
    if (JWT) {
      if (notification) {
        return (
          <NotificationStack />
        );
      }
      return <AuthorizedDrawer />;
    }
    return <UnauthorizedStack initialRoute={initialRoute} />;
  }

  return (
    <NavigationContainer>
      {getNavigation()}
    </NavigationContainer>
  );
}
