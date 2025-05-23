import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Box, Text, VStack, HStack, Pressable } from 'native-base';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../Colors/Color';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from './Index';
import { authService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterScreen'>;

const RegisterScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
        position: 'top',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
        position: 'top',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.register(username, email, password);
      if (response.token) {
        // Store the token using AsyncStorage
        await AsyncStorage.setItem('token', response.token);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Registration successful!',
          position: 'top',
        });
        // Navigate to Coins screen
        navigation.navigate('Login');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Registration failed. Please try again.',
        position: 'top',
      });
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
            Create Account
          </Text>
          <Text fontSize="md" color={Colors.textSecondary}>
            Start your mining journey today
          </Text>
        </VStack>

        {/* Registration Form */}
        <VStack space={4}>
          {/* Full Name Input */}
          <Box>
            <HStack space={2} alignItems="center" bg={Colors.surface} p={3} rounded="lg" borderWidth={1} borderColor={Colors.border}>
              <MaterialIcons name="person" size={24} color={Colors.primary} />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={Colors.placeholder}
                style={styles.input}
                autoCapitalize="words"
                value={username}
                onChangeText={setUsername}
              />
            </HStack>
          </Box>

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

          {/* Confirm Password Input */}
          <Box>
            <HStack space={2} alignItems="center" bg={Colors.surface} p={3} rounded="lg" borderWidth={1} borderColor={Colors.border}>
              <Ionicons name="lock-closed" size={24} color={Colors.primary} />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={Colors.placeholder}
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color={Colors.primary}
                />
              </Pressable>
            </HStack>
          </Box>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.primary }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text color={Colors.buttonText} fontSize="md" fontWeight="bold">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <HStack space={1} justifyContent="center" mt={4}>
            <Text color={Colors.textSecondary}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text color={Colors.primary} fontWeight="bold">
                Sign In
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

export default RegisterScreen; 