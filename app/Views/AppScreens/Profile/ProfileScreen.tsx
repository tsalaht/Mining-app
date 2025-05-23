import React, { useEffect, useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  ScrollView,
  Pressable,
  Spinner,
  Button,
} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import Colors from '../../../Colors/Color';
import { useNavigation } from '@react-navigation/native';
import { userService, walletService } from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  username: string;
  email: string;
  level: number;
  mining_rate: number;
  coins: Array<{
    symbol: string;
    balance: string;
  }>;
}

const ProfileScreen = () => {
  const [glow] = useState(new Animated.Value(0));
  const navigation: any = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, [retryCount]);

  const fetchUserData = async () => {
    try {
      console.log('Starting to fetch user data...');
      setLoading(true);
      setError(null);

      // Check if we have a token
      const token = await AsyncStorage.getItem('token');
      console.log('Current token status:', !!token);

      if (!token) {
        console.log('No token found, redirecting to login');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      console.log('Fetching profile data...');
      const profileData = await userService.getProfile();


 
      const walletData = await walletService.getWallet();
 

      setUserData({
        ...profileData,
        coins: walletData.coins || [],
      });
 
    } catch (err) {
      
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
  
    setRetryCount(prev => prev + 1);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await AsyncStorage.removeItem('token');
      console.log('Token removed');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    // Glow animation for profile card
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 3000,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.3,
          duration: 3000,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glow.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0.2, 0.8],
  });

  // Sample user preferences/settings data
  const preferences = [
    {
      id: 1,
      type: 'Notifications',
      status: 'Enabled',
      description: 'Receive push notifications for updates.',
    },
    {
      id: 2,
      type: 'Two-Factor Authentication',
      status: 'Disabled',
      description: 'Enhance account security.',
    },
    {
      id: 3,
      type: 'Membership',
      status: userData?.level === 10 ? 'Premium' : 'Standard',
      description: 'Current plan status.',
    },
  ];

  if (loading) {
    return (
      <Box flex={1} bg={Colors.background} justifyContent="center" alignItems="center">
        <Spinner size="lg" color={Colors.primary} />
        <Text mt={4} color={Colors.text}>Loading profile data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} bg={Colors.background} justifyContent="center" alignItems="center" p={4}>
        <Text color={Colors.danger} fontSize="lg" mb={4}>{error}</Text>
        <Button
          onPress={handleRetry}
          bg={Colors.primary}
          _pressed={{ opacity: 0.7 }}
        >
          <Text color={Colors.buttonText}>Retry</Text>
        </Button>
      </Box>
    );
  }

  return (
    <ScrollView flex={1} bg={Colors.background}>
      <VStack space={6} alignItems="center" px={4} pt={8} pb={32}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={{
            width: '100%',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text
            fontSize="2xl"
            fontWeight="700"
            color={Colors.buttonText}
            textAlign="center"
          >
            Your Profile
          </Text>
        </LinearGradient>

        {/* Profile Info Card */}
        <Animated.View
          style={{
            width: '100%',
            shadowColor: Colors.accent,
            shadowOpacity: glowOpacity,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 0 },
          }}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={{
              borderRadius: 16,
              padding: 20,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <HStack alignItems="center" space={2}>
              <Icon
                as={MaterialCommunityIcons}
                name="account-circle"
                size={10}
                color={Colors.buttonText}
              />
              <Text fontSize="xl" fontWeight="600" color={Colors.buttonText}>
                {userData?.username}
              </Text>
            </HStack>
            <Text
              fontSize="md"
              fontWeight="500"
              color={Colors.buttonText}
              mt={2}
            >
              {userData?.email}
            </Text>
            <Text fontSize="sm" color={Colors.inputBackground} mt={1}>
              Level {userData?.level} • Mining Rate: {userData?.mining_rate}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Wallet Section */}
        <Box w="100%" bg={Colors.surface} p={4} borderRadius={16} borderWidth={1} borderColor={Colors.border}>
          <Text fontSize="lg" fontWeight="600" color={Colors.text} mb={4}>
            Your Wallet
          </Text>
          <VStack space={3}>
            {userData?.coins.map((coin, index) => (
              <HStack key={index} justifyContent="space-between" alignItems="center">
                <Text fontSize="md" color={Colors.text}>
                  {coin.symbol}
                </Text>
                <Text fontSize="md" fontWeight="600" color={Colors.text}>
                  {coin.balance}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Action Buttons */}
        <HStack space={2} w="100%" justifyContent="center" flexWrap="wrap">
          <Pressable
            onPress={() => navigation.navigate('EditProfileScreen')}
            _pressed={{ opacity: 0.7 }}
            flexBasis="48%"
            mb={2}
          >
            <Box
              bg={Colors.surface}
              p={4}
              borderRadius={12}
              shadow={2}
              borderWidth={1}
              borderColor={Colors.border}
              alignItems="center"
            >
              <Icon
                as={MaterialCommunityIcons}
                name="pencil"
                size={6}
                color={Colors.success}
              />
              <Text fontSize="md" fontWeight="600" color={Colors.text} mt={2}>
                Edit Profile
              </Text>
            </Box>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('PolicyScreen')}
            _pressed={{ opacity: 0.7 }}
            flexBasis="48%"
            mb={2}
          >
            <Box
              bg={Colors.surface}
              p={4}
              borderRadius={12}
              shadow={2}
              borderWidth={1}
              borderColor={Colors.border}
              alignItems="center"
            >
              <Icon
                as={MaterialCommunityIcons}
                name="shield-lock"
                size={6}
                color={Colors.accent}
              />
              <Text fontSize="md" fontWeight="600" color={Colors.text} mt={2}>
                Privacy Policy
              </Text>
            </Box>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('LevelsScreen')}
            _pressed={{ opacity: 0.7 }}
            flexBasis="48%"
            mb={2}
          >
            <Box
              bg={Colors.surface}
              p={4}
              borderRadius={12}
              shadow={2}
              borderWidth={1}
              borderColor={Colors.border}
              alignItems="center"
            >
              <Icon
                as={MaterialCommunityIcons}
                name="trophy"
                size={6}
                color={Colors.primary}
              />
              <Text fontSize="md" fontWeight="600" color={Colors.text} mt={2}>
                Levels
              </Text>
            </Box>
          </Pressable>
          <Pressable
            onPress={handleLogout}
            _pressed={{ opacity: 0.7 }}
            flexBasis="48%"
            mb={2}
          >
            <Box
              bg={Colors.surface}
              p={4}
              borderRadius={12}
              shadow={2}
              borderWidth={1}
              borderColor={Colors.border}
              alignItems="center"
            >
              <Icon
                as={MaterialCommunityIcons}
                name="logout"
                size={6}
                color={Colors.danger}
              />
              <Text fontSize="md" fontWeight="600" color={Colors.text} mt={2}>
                Log Out
              </Text>
            </Box>
          </Pressable>
        </HStack>

        {/* User Preferences/Settings */}
        <Box w="100%">
          <Text color={Colors.text} fontSize="lg" fontWeight="600" mb={3}>
            Account Settings
          </Text>
          <VStack space={3}>
            {preferences.map((pref) => (
              <Box
                key={pref.id}
                bg={Colors.surface}
                p={4}
                borderRadius={12}
                shadow={1}
                borderWidth={1}
                borderColor={Colors.border}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text fontSize="md" fontWeight="600" color={Colors.text}>
                      {pref.type}
                    </Text>
                    <Text fontSize="xs" color={Colors.muted}>
                      {pref.description}
                    </Text>
                  </VStack>
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color={
                      pref.status === 'Enabled' || pref.status === 'Premium'
                        ? Colors.success
                        : Colors.warning
                    }
                  >
                    {pref.status}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
};

export default ProfileScreen;