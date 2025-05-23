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
import { authService } from '../../services/api';
import { useCustomToast } from '../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { showSuccess, showError } = useCustomToast();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);

      const response = await authService.login(email, password);

      if (response?.token) {
        await AsyncStorage.setItem('token', response.token);
        showSuccess('Login successful!');
    navigation.navigate('Coins')
      } else {
        showError('Login failed. No token received.');
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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
                value={email}
                onChangeText={setEmail}
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
                value={password}
                onChangeText={setPassword}
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
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text color={Colors.buttonText} fontSize="md" fontWeight="bold">
              {isLoading ? 'Signing In...' : 'Sign In'}
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