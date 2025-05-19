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
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import Colors from '../../../Colors/Color';

const Wallet = () => {
  const { selectedCoin, minedAmount } = useSelector(
    (state: RootState) => state.coin
  );
  const [glow] = useState(new Animated.Value(0));

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

  // Sample transaction data
  const transactions = [
    {
      id: 1,
      type: 'Mined',
      amount: 0.00000001,
      date: new Date().toLocaleString(),
      status: 'success',
    },
    {
      id: 2,
      type: 'Deposit',
      amount: 0.00005,
      date: new Date(Date.now() - 86400000).toLocaleString(),
      status: 'success',
    },
    {
      id: 3,
      type: 'Withdraw',
      amount: 0.00002,
      date: new Date(Date.now() - 2 * 86400000).toLocaleString(),
      status: 'pending',
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
            Your Wallet
          </Text>
        </LinearGradient>

        {/* Wallet Balance Card */}
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
                name={
                  selectedCoin === 'BTC'
                    ? 'bitcoin'
                    : selectedCoin === 'ETH'
                    ? 'ethereum'
                    : 'currency-usd'
                }
                size={10}
                color={Colors.buttonText}
              />
              <Text fontSize="xl" fontWeight="600" color={Colors.buttonText}>
                {selectedCoin} Balance
              </Text>
            </HStack>
            <Text
              fontSize="3xl"
              fontWeight="700"
              color={Colors.buttonText  }
              mt={2}
            >
              {minedAmount.toFixed(8)} {selectedCoin}
            </Text>
            <Text fontSize="sm" color={Colors.inputBackground} mt={1}>
              ≈ ${(minedAmount * 50000).toFixed(2)} USD
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Action Buttons */}
        <HStack space={4} w="100%" justifyContent="center">
          <Pressable
            onPress={() => console.log('Deposit pressed')}
            _pressed={{ opacity: 0.7 }}
            flex={1}
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
                name="arrow-down-bold"
                size={6}
                color={Colors.success}
              />
              <Text fontSize="md" fontWeight="600" color={Colors.text} mt={2}>
                Deposit
              </Text>
            </Box>
          </Pressable>
          <Pressable
            onPress={() => console.log('Withdraw pressed')}
            _pressed={{ opacity: 0.7 }}
            flex={1}
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
                name="arrow-up-bold"
                size={6}
                color={Colors.danger}
              />
              <Text fontSize="md" fontWeight="600" color={Colors.text} mt={2}>
                Withdraw
              </Text>
            </Box>
          </Pressable>
        </HStack>

        {/* Recent Transactions */}
        <Box w="100%">
          <Text color={Colors.text} fontSize="lg" fontWeight="600" mb={3}>
            Recent Transactions
          </Text>
          <VStack space={3}>
            {transactions.map((tx) => (
              <Box
                key={tx.id}
                bg={Colors.surface}
                p={4}
                borderRadius={12}
                shadow={1}
                borderWidth={1}
                borderColor={Colors.border}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      color={Colors.text}
                    >
                      {tx.type} {selectedCoin}
                    </Text>
                    <Text fontSize="xs" color={Colors.muted}>
                      {tx.date}
                    </Text>
                  </VStack>
                  <VStack alignItems="flex-end">
                    <Text
                      fontSize="md"
                      fontWeight="600"
                      color={
                        tx.type === 'Withdraw'
                          ? Colors.danger
                          : Colors.success
                      }
                    >
                      {tx.type === 'Withdraw' ? '-' : '+'}
                      {tx.amount.toFixed(8)} {selectedCoin}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={
                        tx.status === 'success'
                          ? Colors.success
                          : Colors.warning
                      }
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
};

export default Wallet;