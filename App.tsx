import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import './src/i18n';

const queryClient = new QueryClient();

const linking = {
  prefixes: [],
  config: {
    screens: {
      HomeTab: '',
      ExploreTab: 'explore',
      WalletTab: 'wallet',
      ServicesTab: 'services',
      ProfileTab: 'profile',
    },
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer linking={Platform.OS === 'web' ? linking : undefined}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <MainTabNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
