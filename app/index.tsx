import React from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './redux';
import {PersistGate} from 'redux-persist/integration/react';
import App from './navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from './contexts/User';
const queryClient = new QueryClient();
import * as Utils from '../app/utils';

Utils.setupLayoutAnimation();

const Foresite = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <AuthProvider>
              <App />
            </AuthProvider>

            <FlashMessage duration={4000} position="top" />
          </SafeAreaProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default Foresite;
