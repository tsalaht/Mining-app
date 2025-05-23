import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Icon,
  ScrollView,
  Pressable,
  useToast,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import Colors from '../../../Colors/Color';
import { increaseMiningSpeed } from '../../../../store/coinSlice';
import { upgradeService } from '../../../../app/services/api';

const Upgrade = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { selectedCoin, miningSpeed, minedAmount } = useSelector(
    (state: RootState) => state.coin
  );
  const [glow] = useState(new Animated.Value(0));
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchUpgradePrices();
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

  const fetchUpgradePrices = async () => {
    try {
      const response = await upgradeService.getUpgradePrice();
      if (response && response.price) {
        setPrices(response.price);
      } else {
        setPrices({}); // Set empty object if no prices
      }
    } catch (error) {
      console.error('Error fetching upgrade prices:', error);
      setPrices({}); // Set empty object on error
      toast.show({
        title: "Error",
        description: "Failed to fetch upgrade prices",
        variant: "solid",
        bg: "error.500"
      });
    }
  };

  const glowOpacity = glow.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0.2, 0.8],
  });

  const handlePurchase = async () => {
    if (selectedPackage !== null) {
      try {
        setLoading(true);
        const selected = upgradePackages.find((pkg) => pkg.id === selectedPackage);
        if (selected) {
          // Get the coin symbol from the selected package
          const coinSymbol = Object.keys(prices)[selectedPackage - 1];
          const response = await upgradeService.upgrade(coinSymbol);
          
          // Update mining speed in Redux
          dispatch(increaseMiningSpeed(miningSpeed + selected.speed));
          
          toast.show({
            title: "Success",
            description: `Upgraded successfully! New level: ${response.level}`,
            variant: "solid",
            bg: "success.500"
          });
          
          setSelectedPackage(null); // Reset selection
          await fetchUpgradePrices(); // Refresh prices
        }
      } catch (error) {
        console.error('Error upgrading:', error);
        toast.show({
          title: "Error",
          description: "Failed to upgrade. Please try again.",
          variant: "solid",
          bg: "error.500"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Convert prices to upgrade packages with null check
  const upgradePackages = prices ? Object.entries(prices).map(([coin, price], index) => ({
    id: index + 1,
    speed: 10 * (index + 1), // Increase speed with each level
    cost: price,
    coin: coin
  })) : [];

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
                        {pkg.cost} {pkg.coin}
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
          isDisabled={selectedPackage === null || loading}
        >
          <LinearGradient
            colors={
              selectedPackage === null || loading
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
                {loading ? 'Processing...' : 'Purchase Upgrade'}
              </Text>
            </HStack>
          </LinearGradient>
        </Pressable>
      </VStack>
    </ScrollView>
  );
};

export default Upgrade;