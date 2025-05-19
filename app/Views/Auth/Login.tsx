import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Box, Text, VStack, HStack, Pressable } from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Colors from '../../Colors/Color';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from './Index';
import { setPassHome } from '../../../store/PassHomeSlice';
import { useSelector, useDispatch } from 'react-redux';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <Box flex={1} bg={Colors.background} safeArea>
      <VStack space={5} flex={1} px={6} py={8}>
        {/* Header */}
        <VStack space={2} mb={8}>
          <Text fontSize="3xl" fontWeight="bold" color={Colors.text}>
            Welcome Back
          </Text>
          <Text fontSize="md" color={Colors.textSecondary}>
            Sign in to continue mining
          </Text>
        </VStack>

        {/* Login Form */}
        <VStack space={4}>
          {/* Email Input */}
          <Box>
            <HStack space={2} alignItems="center" bg={Colors.surface} p={3} rounded="lg" borderWidth={1} borderColor={Colors.border}>
              <MaterialIcons name="email" size={24} color={Colors.primary} />
              <TextInput
                placeholder="Email"
                placeholderTextColor={Colors.placeholder}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                
              />
            </HStack>
          </Box>

          {/* Password Input */}
          <Box>
            <HStack space={2} alignItems="center" bg={Colors.surface} p={3} rounded="lg" borderWidth={1} borderColor={Colors.border}>
              <Ionicons name="lock-closed" size={24} color={Colors.primary} />
              <TextInput
                placeholder="Password"
                placeholderTextColor={Colors.placeholder}
                style={styles.input}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color={Colors.primary}
                />
              </Pressable>
            </HStack>
          </Box>

          {/* Forgot Password */}
          <Pressable alignSelf="flex-end" onPress={() => navigation.navigate('recoveryPassword')}>
            <Text color={Colors.primary} fontSize="sm">
              Forgot Password?
            </Text>
          </Pressable>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.primary }]}
            // onPress={() => {dispatch(setPassHome(true))}}
            onPress={() => navigation.navigate('Coins')}
          >
            <Text color={Colors.buttonText} fontSize="md" fontWeight="bold">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <HStack space={1} justifyContent="center" mt={4}>
            <Text color={Colors.textSecondary}>Don't have an account?</Text>
            <Pressable onPress={() => navigation.navigate('RegisterScreen')}>
              <Text color={Colors.primary} fontWeight="bold">
                Sign Up
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Login; 