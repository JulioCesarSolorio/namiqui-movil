import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StyleProvider } from 'native-base';
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
              <Root setLoading={setLoading} />
              </SafeAreaView>
            </StyleProvider>
        </PersistGate>
      </Provider>

    </>
  );
};

export default App;
