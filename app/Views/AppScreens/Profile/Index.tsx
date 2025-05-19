import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "./ProfileScreen";
import EditProfileScreen from "./EditProfileScreen";    
import PolicyScreen from "./PolicyScreen";
import LevelsScreen from "./LevelsScreen";

const Stack = createNativeStackNavigator();

const Profile: React.FC<any> = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PolicyScreen"
        component={PolicyScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LevelsScreen"
        component={LevelsScreen}
        options={{
          headerShown: false,
        }}
      />
    
   
    
    </Stack.Navigator>
  );
};

export default Profile;
