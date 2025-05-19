import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import Login from './Login';
import RegisterScreen from './RegisterScreen';
import Coins from './Coins';
import { View } from 'react-native';

export type AuthStackParamList = {
  Login: undefined;
  RegisterScreen: undefined;
  recoveryPassword: undefined;
  Coins: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthPages: React.FC = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'none',
        contentStyle: { backgroundColor: 'transparent' },
        presentation: 'card',
        animationDuration: 0,
      }}
    >
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
      />
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="recoveryPassword"
        component={Login}
      />
      <Stack.Screen
        name="Coins"
        component={Coins}
      />
    </Stack.Navigator>
  );
};

export default AuthPages;
