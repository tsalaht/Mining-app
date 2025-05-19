import React, { useEffect, useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  ScrollView,
  Pressable,
} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import Colors from '../../../Colors/Color';
import { useNavigation } from '@react-navigation/native';

// Static user data
const staticUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  membershipStatus: 'Premium',
};

const ProfileScreen = () => {
  const [glow] = useState(new Animated.Value(0));
  const navigation: any = useNavigation();

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
      status: staticUser.membershipStatus,
      description: 'Current plan status.',
    },
  ];

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
                {staticUser.name}
              </Text>
            </HStack>
            <Text
              fontSize="md"
              fontWeight="500"
              color={Colors.buttonText}
              mt={2}
            >
              {staticUser.email}
            </Text>
            <Text fontSize="sm" color={Colors.inputBackground} mt={1}>
              Member since {new Date().getFullYear()}
            </Text>
          </LinearGradient>
        </Animated.View>

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
            onPress={() => console.log('Log Out pressed')}
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