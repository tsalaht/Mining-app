import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  ScrollView,
  Pressable,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import Colors from '../../../Colors/Color';
import { increaseMiningSpeed } from '../../../../store/coinSlice'; // Assumed action

const Upgrade = () => {
  const dispatch = useDispatch();
  const { selectedCoin, miningSpeed, minedAmount } = useSelector(
    (state: RootState) => state.coin
  );
  const [glow] = useState(new Animated.Value(0));
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // Sample upgrade packages
  const upgradePackages = [
    { id: 1, speed: 10, cost: 50 },
    { id: 2, speed: 50, cost: 200 },
    { id: 3, speed: 100, cost: 350 },
  ];

  useEffect(() => {
    // Glow animation for balance card
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

  const handlePurchase = () => {
    if (selectedPackage !== null) {
      const selected = upgradePackages.find((pkg) => pkg.id === selectedPackage);
      if (selected) {
        // Placeholder: Deduct cost and update speed
        dispatch(increaseMiningSpeed(miningSpeed + selected.speed));
        console.log(
          `Purchased ${selected.speed} GH/s for $${selected.cost}`
        );
        setSelectedPackage(null); // Reset selection
      }
    }
  };

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
            Upgrade Mining Speed
          </Text>
        </LinearGradient>

        {/* Current Stats */}
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
                name="speedometer"
                size={8}
                color={Colors.buttonText}
              />
              <Text fontSize="lg" fontWeight="600" color={Colors.buttonText}>
                Current Mining Speed
              </Text>
            </HStack>
            <Text
              fontSize="2xl"
              fontWeight="700"
              color={Colors.buttonText}
              mt={2}
            >
              {miningSpeed} GH/s
            </Text>
            <Text fontSize="sm" color={Colors.inputBackground} mt={1}>
              Wallet: {minedAmount.toFixed(8)} {selectedCoin}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Upgrade Packages */}
        <Box w="100%">
          <Text color={Colors.text} fontSize="lg" fontWeight="600" mb={3}>
            Available Upgrades
          </Text>
          <VStack space={3}>
            {upgradePackages.map((pkg) => (
              <Pressable
                key={pkg.id}
                onPress={() => setSelectedPackage(pkg.id)}
                _pressed={{ opacity: 0.7 }}
              >
                <Box
                  bg={Colors.surface}
                  p={4}
                  borderRadius={12}
                  shadow={2}
                  borderWidth={2}
                  borderColor={
                    selectedPackage === pkg.id
                      ? Colors.accent
                      : Colors.border
                  }
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                      <Text
                        fontSize="md"
                        fontWeight="600"
                        color={Colors.text}
                      >
                        {pkg.speed} GH/s
                      </Text>
                      <Text
                        fontSize="sm"
                        color={Colors.textSecondary}
                      >
                        Boost your mining power
                      </Text>
                    </VStack>
                    <VStack alignItems="flex-end">
                      <Text
                        fontSize="md"
                        fontWeight="600"
                        color={Colors.primary}
                      >
                        ${pkg.cost}
                      </Text>
                      <Text fontSize="xs" color={Colors.success}>
                        One-time purchase
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </Pressable>
            ))}
          </VStack>
        </Box>

        {/* Purchase Button */}
        <Pressable
          onPress={handlePurchase}
          _pressed={{ opacity: 0.7 }}
          w="100%"
          isDisabled={selectedPackage === null}
        >
          <LinearGradient
            colors={
              selectedPackage === null
                ? [Colors.muted, Colors.muted]
                : [Colors.primary, Colors.secondary]
            }
            style={{
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
            }}
          >
            <HStack alignItems="center" space={2}>
              <Icon
                as={MaterialCommunityIcons}
                name="cart"
                size={6}
                color={Colors.inputBackground}
              />
              <Text
                fontSize="lg"
                fontWeight="600"
                color={Colors.inputBackground}
              >
                Purchase Upgrade
              </Text>
            </HStack>
          </LinearGradient>
        </Pressable>
      </VStack>
    </ScrollView>
  );
};

export default Upgrade;