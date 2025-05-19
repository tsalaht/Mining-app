import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Box, Text, VStack, HStack, Pressable } from 'native-base';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../../Colors/Color';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from './Index';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterScreen'>;

const RegisterScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

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

          {/* Confirm Password Input */}
          <Box>
            <HStack space={2} alignItems="center" bg={Colors.surface} p={3} rounded="lg" borderWidth={1} borderColor={Colors.border}>
              <Ionicons name="lock-closed" size={24} color={Colors.primary} />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={Colors.placeholder}
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
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
            onPress={() => {}}
          >
            <Text color={Colors.buttonText} fontSize="md" fontWeight="bold">
              Create Account
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