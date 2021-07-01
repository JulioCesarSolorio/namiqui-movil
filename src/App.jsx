import React, { useState, useEffect } from 'react';
import Config from 'react-native-config';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StyleProvider } from 'native-base';
import { StripeProvider } from '@stripe/stripe-react-native';
import SplashScreen from 'react-native-splash-screen';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import configureStore from './configureStore';
import Root from './navigation/Root';
import { SafeAreaView } from 'react-native-safe-area-context';

const { store, persistor } = configureStore();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!loading) {
      SplashScreen.hide();
    }

  }, [loading]);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StyleProvider style={getTheme(platform)}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1F' }}>
              <StripeProvider publishableKey={Config.STRIPE_PUBLISHABLE_KEY}>
                <Root setLoading={setLoading} />
              </StripeProvider>
            </SafeAreaView>
          </StyleProvider>
        </PersistGate>
      </Provider>

    </>
  );
};

export default App;
