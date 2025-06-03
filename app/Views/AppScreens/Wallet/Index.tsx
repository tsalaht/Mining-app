import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import Wallet from './Wallet';
import { View } from 'react-native';
import Deposit from './Deposit';
import Withdraw from './Withdraw';


const Stack = createNativeStackNavigator<any>();

const MyWallet: React.FC = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Wallet"
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'default' : 'none',
        contentStyle: { backgroundColor: 'transparent' },
        presentation: 'card',
        animationDuration: 0,
      }}
    >
      <Stack.Screen
        name="Wallet"
        component={Wallet}
      />
         <Stack.Screen
        name="Withdraw"
        component={Withdraw}
      />
               <Stack.Screen
        name="Deposit"
        component={Deposit}
      />
    </Stack.Navigator>
  );
};

export default MyWallet;
