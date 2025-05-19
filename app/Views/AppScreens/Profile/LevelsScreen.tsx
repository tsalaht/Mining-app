import React, { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Text,
  Pressable,
  ScrollView,
  HStack,
  Image,
  Icon,
} from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../../Colors/Color';
import level1 from '../../../../assets/Levels/1.png';
import level2 from '../../../../assets/Levels/2.jpg';
import level3 from '../../../../assets/Levels/3.jpg';
import level4 from '../../../../assets/Levels/4.jpg';
import level5 from '../../../../assets/Levels/5.jpg';
import level6 from '../../../../assets/Levels/6.jpg';
import level7 from '../../../../assets/Levels/7.jpg';
import level8 from '../../../../assets/Levels/8.jpg';
import level9 from '../../../../assets/Levels/9.jpg';
import level10 from '../../../../assets/Levels/10.jpg';
import level11 from '../../../../assets/Levels/11.jpg';
import level12 from '../../../../assets/Levels/11.jpg'; // Fixed to correct image

import { useNavigation } from '@react-navigation/native';

// Static user level data
let currentLevelIndex = 0; // Tracks user's current level (0 = Bronze, 11 = Royal Ambandor)

// Define 12 mining-themed levels with descriptions and rewards in English
const levels = [
  {
    name: 'Bronze',
    color: '#cd7f32',
    image: level1,
    description: 'For any officially registered subscriber',
    reward: 'Free NX coin as a subscription gift',
  },
  {
    name: 'Silver',
    color: '#c0c0c0',
    image: level2,
    description: '2 subscribers via link and purchase of $50 package',
    reward: '$5',
  },
  {
    name: 'Gold',
    color: '#ffd700',
    image: level3,
    description: '5 subscribers via link and purchase of $100 package',
    reward: '$10',
  },
  {
    name: 'Platinum',
    color: '#e5e4e2',
    image: level4,
    description: '10 subscribers via link and purchase of $200 package',
    reward: '$20',
  },
  {
    name: 'Diamond',
    color: '#b9f2ff',
    image: level5,
    description: '15 subscribers via link and purchase of $500 package',
    reward: '$50',
  },
  {
    name: 'Emerald',
    color: '#50c878',
    image: level6,
    description: '20 subscribers via link and purchase of $1000 package',
    reward: '$100',
  },
  {
    name: 'Ruby',
    color: '#e0115f',
    image: level7,
    description: '25 subscribers via link and purchase of $1500 package',
    reward: '$150',
  },
  {
    name: 'Black Diamond',
    color: '#0f52ba',
    image: level8,
    description: '30 subscribers via link and purchase of $2000 package',
    reward: '$200',
  },
  {
    name: 'Bleu Diamond',
    color: '#9966cc',
    image: level9,
    description: '40 subscribers via link and purchase of $2500 package',
    reward: '$250',
  },
  {
    name: 'Obsidian',
    color: '#2f2f2f',
    image: level10,
    description: '50 subscribers via link and purchase of $3000 package',
    reward: '$300',
  },
  {
    name: 'Ambassador',
    color: '#878681',
    image: level11,
    description: '75 subscribers via link and purchase of $5000 package',
    reward: '$500',
  },
  {
    name: 'Royal Ambandor',
    color: '#4b0082',
    image: level12,
    description: '100 subscribers via link and purchase of $10000 package',
    reward: '$1000',
  },
];

const LevelsScreen = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade-in animation for levels
  const [scaleAnim] = useState(new Animated.Value(1)); // Scale animation for button

  useEffect(() => {
    // Fade-in animation for levels
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleWatchAd = () => {
    if (currentLevelIndex >= levels.length - 1) {
      alert('You have reached the maximum level: Royal Ambandor!');
      return;
    }

    // Simulate ad watching with a 5-second delay
    alert('Watching ad... Please wait.');
    setTimeout(() => {
      currentLevelIndex += 1;
      alert(`Congratulations! You have upgraded to ${levels[currentLevelIndex].name} level!`);
      // Force re-render by updating state
      setCurrentLevel(currentLevelIndex);
    }, 5000);
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  // State to force re-render when level changes
  const [currentLevel, setCurrentLevel] = useState(currentLevelIndex);

  return (
    <ScrollView flex={1} bg={Colors.background} _dark={{ bg: '#1a1a1a' }}>
      <VStack space={4} alignItems="center" px={4} pt={8} pb={24}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          style={{
            width: '100%',
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
            shadowColor: Colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={Colors.buttonText}
            textAlign="center"
          >
            Your Mining Levels
          </Text>
        </LinearGradient>

        {/* Current Level Display */}
        <Box
          bg={Colors.surface}
          p={4}
          borderRadius={12}
          shadow={3}
          borderWidth={1}
          borderColor={Colors.accent}
          w="100%"
          _dark={{ bg: '#2a2a2a' }}
        >
          <HStack alignItems="center" space={4} justifyContent="center">
            <Image
              source={levels[currentLevelIndex].image}
              alt={levels[currentLevelIndex].name}
              size="md"
              borderRadius={10}
              resizeMode="contain"
            />
            <VStack  flex={1}>
              <Text fontSize="lg" fontWeight="bold" color={Colors.text}>
                {levels[currentLevelIndex].name}
              </Text>
              <Text fontSize="sm" color={Colors.muted} mt={1}>
                Level {currentLevelIndex + 1} of {levels.length}
              </Text>
              <Text
                fontSize="sm"
                color={Colors.text}
                mt={2}
                textAlign="left"
                numberOfLines={2}
              >
                {levels[currentLevelIndex].description}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={Colors.success}
                mt={1}
                textAlign="left"
              >
                Reward: {levels[currentLevelIndex].reward}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Levels List */}
        <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
          <VStack space={2}>
            {levels.map((level, index) => (
              <Box
                key={level.name}
                p={3}
                borderRadius={12}
                shadow={index <= currentLevelIndex ? 2 : 1}
                borderWidth={1}
                borderColor={index <= currentLevelIndex ? Colors.accent : Colors.border}
                opacity={index <= currentLevelIndex ? 1 : 0.7}
                _light={{
                  bg: index <= currentLevelIndex ? Colors.surface : '#f5f5f5',
                }}
                _dark={{
                  bg: index <= currentLevelIndex ? '#2a2a2a' : '#333333',
                }}
              >
                <LinearGradient
                  colors={
                    index <= currentLevelIndex
                      ? [level.color + '22', level.color + '11']
                      : ['#ffffff11', '#ffffff08']
                  }
                  style={{
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <HStack
                    justifyContent="space-between"
                    alignItems="center"
                    space={3}
                  >
                    <HStack space={3} alignItems="center" flex={1}>
                      <Image
                        source={level.image}
                        alt={level.name}
                        size="sm"
                        borderRadius={8}
                        resizeMode="contain"
                      />
                      <VStack flex={1}>
                        <Text
                          fontSize="md"
                          fontWeight="600"
                          color={index <= currentLevelIndex ? Colors.text : Colors.muted}
                        >
                          {level.name}
                        </Text>
                        <Text fontSize="xs" color={Colors.muted}>
                          Level {index + 1}
                        </Text>
                        <Text
                          fontSize="xs"
                          color={Colors.text}
                          mt={1}
                          textAlign="left"
                          numberOfLines={2}
                        >
                          {level.description}
                        </Text>
                        <Text
                          fontSize="xs"
                          fontWeight="medium"
                          color={Colors.success}
                          mt={1}
                          textAlign="left"
                        >
                          Reward: {level.reward}
                        </Text>
                      </VStack>
                    </HStack>
                    <Icon
                      as={MaterialCommunityIcons}
                      name={index <= currentLevelIndex ? 'check-circle' : 'lock'}
                      size={5}
                      color={index <= currentLevelIndex ? Colors.success : Colors.warning}
                    />
                  </HStack>
                </LinearGradient>
              </Box>
            ))}
          </VStack>
        </Animated.View>

        {/* Watch Ad to Upgrade Button */}
        {currentLevelIndex < levels.length - 1 && (
          <Pressable
            onPress={handleWatchAd}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            w="100%"
            mt={4}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <LinearGradient
                colors={[Colors.primary, Colors.accent]}
                style={{
                  borderRadius: 14,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  alignItems: 'center',
                  shadowColor: Colors.accent,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 8,
                }}
              >
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={Colors.buttonText}
                  textAlign="center"
                >
                  Watch Ad to Upgrade to {levels[currentLevelIndex + 1].name}
                </Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>
        )}
      </VStack>
    </ScrollView>
  );
};

export default LevelsScreen;