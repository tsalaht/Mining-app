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
  Spinner,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import Colors from '../../../Colors/Color';
import { increaseMiningSpeed } from '../../../../store/coinSlice';
import { upgradeService } from '../../../../app/services/api';

interface UpgradePackage {
  id: number;
  level: number;
  miningRate: number;
  cost: number;
  coin: string;
}

interface ApiPriceResponse {
  level: number;
  mining_rate: string;
  price_amount: string;
  symbol: string;
}

const Upgrade = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { selectedCoin, miningSpeed, minedAmount } = useSelector(
    (state: RootState) => state.coin
  );
  const [glow] = useState(new Animated.Value(0));
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<ApiPriceResponse[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch upgrade prices
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
      setLoading(true);
      setFetchError(null);
      const response = await upgradeService.getUpgradePrice();
      console.log('Upgrade prices response:', JSON.stringify(response, null, 2)); // Detailed debug log
      if (response && Array.isArray(response) && response.length > 0) {
        setPrices(response);
      } else {
        console.warn('Invalid or empty response:', response);
        setFetchError('No upgrade prices available');
        setPrices([]);
        toast.show({
          title: 'Warning',
          description: 'No upgrade prices available from server',
          variant: 'solid',
          bg: Colors.warning,
        });
      }
    } catch (error: any) {
      console.error('Error fetching upgrade prices:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setFetchError('Failed to fetch upgrade prices');
      setPrices([]);
      toast.show({
        title: 'Error',
        description: 'Failed to fetch upgrade prices. Please try again.',
        variant: 'solid',
        bg: Colors.danger,
      });
    } finally {
      setLoading(false);
    }
  };

  const glowOpacity = glow.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0.2, 0.8],
  });

  const handlePurchase = async () => {
    if (selectedPackage === null) {
      toast.show({
        title: 'Error',
        description: 'Please select an upgrade package',
        variant: 'solid',
        bg: Colors.danger,
      });
      return;
    }

    try {
      setLoading(true);
      const selected = upgradePackages.find((pkg) => pkg.id === selectedPackage);
      if (selected) {
        if (selected.cost > minedAmount) {
          toast.show({
            title: 'Error',
            description: 'Insufficient your score for this upgrade',
            variant: 'solid',
            bg: Colors.danger,
          });
          return;
        }

        const response = await upgradeService.upgrade(selected.coin);
        dispatch(increaseMiningSpeed(miningSpeed + selected.miningRate));

        toast.show({
          title: 'Success',
          description: `Upgraded successfully! New level: ${response.level}`,
          variant: 'solid',
          bg: Colors.success,
        });

        setSelectedPackage(null);
        await fetchUpgradePrices(); // Refresh prices
      }
    } catch (error: any) {
      console.error('Error upgrading:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.show({
        title: 'Error',
        description: error.message || 'Failed to upgrade. Please try again.',
        variant: 'solid',
        bg: Colors.danger,
      });
    } finally {
      setLoading(false);
    }
  };

  // Construct upgrade packages from prices
  const upgradePackages: UpgradePackage[] = prices
    ? prices.map((item, index) => {
        // Ensure item has required fields
        if (!item?.level || !item?.mining_rate || !item?.price_amount || !item?.symbol) {
          console.warn('Invalid price item:', item);
          return null;
        }
        return {
          id: index + 1,
          level: item.level,
          miningRate: parseFloat(item.mining_rate) || 0,
          cost: parseFloat(item.price_amount) || 0,
          coin: item.symbol,
        };
      }).filter((pkg): pkg is UpgradePackage => pkg !== null) // Remove null entries
    : [];

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
          {loading ? (
            <VStack alignItems="center" py={4}>
              <Spinner color={Colors.primary} size="lg" />
              <Text color={Colors.text} mt={2}>
                Loading upgrade packages...
              </Text>
            </VStack>
          ) : fetchError ? (
            <Text color={Colors.danger} textAlign="center">
              {fetchError}
            </Text>
          ) : upgradePackages.length === 0 ? (
            <Text color={Colors.textSecondary} textAlign="center">
              No upgrade packages available
            </Text>
          ) : (
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
                          Level {pkg.level} (+{pkg.miningRate} GH/s)
                        </Text>
                        <Text fontSize="sm" color={Colors.textSecondary}>
                          Boost your mining power
                        </Text>
                      </VStack>
                      <VStack alignItems="flex-end">
                        <Text
                          fontSize="md"
                          fontWeight="600"
                          color={Colors.primary}
                        >
                          {pkg.cost.toFixed(8)} {pkg.coin}
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
          )}
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
                color={Colors.buttonText}
              />
              <Text
                fontSize="lg"
                fontWeight="600"
                color={Colors.buttonText}
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