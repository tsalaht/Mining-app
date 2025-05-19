import React, { useEffect, useState, useRef } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Image,
  ScrollView,
  Pressable,
  useToast,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { updateMinedAmount, increaseMiningSpeed } from '../../../../store/coinSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Easing, Clipboard } from 'react-native';
import Colors from '../../../Colors/Color';

const Home = () => {
  const dispatch = useDispatch();
  const { selectedCoin, miningSpeed, minedAmount } = useSelector(
    (state: RootState) => state.coin
  );
  const { isMining } = useSelector((state: RootState) => state.mining);
  const [rotation] = useState(new Animated.Value(0));
  const [pulse] = useState(new Animated.Value(0));
  const [glow] = useState(new Animated.Value(0));
  const [uptime, setUptime] = useState(0);
  const [displayedMinedAmount, setDisplayedMinedAmount] = useState(minedAmount);
  const miningIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const referralCode = 'REF123456'; // Static for demo; replace with dynamic value from store/API

  const getCoinImage = () => {
    switch (selectedCoin) {
      case 'BTC':
        return require('../../../../assets/Coins/Bitcoin.jpg');
      case 'NX':
        return require('../../../../assets/Coins/Nexa.jpg');
      case 'MKR':
        return require('../../../../assets/Coins/Maker.jpg');
      case 'ETH':
        return require('../../../../assets/Coins/Ethereum.jpg');
      case 'RUY':
        return require('../../../../assets/Coins/Ruby.jpg');
      default:
        return require('../../../../assets/Coins/Bitcoin.jpg');
    }
  };

  useEffect(() => {
    if (isMining) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 12000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 5000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 5000,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 4000,
            easing: Easing.out(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0.3,
            duration: 4000,
            easing: Easing.in(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      miningIntervalRef.current = setInterval(() => {
        const increment = 0.00000001;
        dispatch(updateMinedAmount(minedAmount + increment));
        setDisplayedMinedAmount((prev) => {
          const next = prev + increment;
          return next > minedAmount + increment ? minedAmount + increment : next;
        });
        setUptime((prev) => prev + 1);
      }, 50);
    } else {
      rotation.setValue(0);
      pulse.setValue(0);
      glow.setValue(0);
      if (miningIntervalRef.current) {
        clearInterval(miningIntervalRef.current);
      }
      setDisplayedMinedAmount(minedAmount);
    }

    return () => {
      if (miningIntervalRef.current) {
        clearInterval(miningIntervalRef.current);
      }
    };
  }, [isMining, minedAmount]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 0.3],
  });

  const glowOpacity = glow.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0.3, 0.9],
  });

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleWatchAd = () => {
    dispatch(increaseMiningSpeed(3));
  };

  const handleCopyReferral = () => {
    Clipboard.setString(referralCode);
    setIsCopied(true);
    toast.show({
      description: 'Referral code copied!',
      duration: 2000,
      placement: 'top',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <ScrollView flex={1} bg={Colors.background}>
      <VStack space={6} alignItems="center" px={4} pt={8} pb={32}>
        <Text
          fontSize="2xl"
          fontWeight="700"
          color={Colors.text}
          textAlign="center"
        >
          Mining Dashboard
        </Text>

        <Box
          borderRadius={16}
          p={6}
          alignItems="center"
        >
          {isMining && (
            <Animated.View
              style={{
                position: 'absolute',
                width: 180,
                height: 180,
                borderRadius: 90,
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              }}
            >
              <LinearGradient
                colors={[Colors.accent, 'transparent']}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 90,
                }}
              />
            </Animated.View>
          )}
          <LinearGradient
            colors={[Colors.primary, Colors.secondary, Colors.accent, Colors.primary]}
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 100,
              opacity: isMining ? 1 : 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Animated.View
              style={{
                width: 185,
                height: 185,
                borderRadius: 92.5,
                backgroundColor: Colors.surface,
                transform: [{ rotate: spin }],
                borderWidth: 3,
                borderColor: 'transparent',
                shadowColor: Colors.accent,
                shadowOpacity: glowOpacity,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 0 },
              }}
            />
          </LinearGradient>
          <Animated.View
            style={{
              shadowColor: Colors.accent,
              shadowOpacity: glowOpacity,
              shadowRadius: 15,
              shadowOffset: { width: 0, height: 0 },
            }}
          >
            <Image
              source={getCoinImage()}
              alt={selectedCoin}
              size="2xl"
              resizeMode="cover"
              height={120}
              width={120}
              rounded={'full'}
            />
          </Animated.View>
          <Text
            fontSize="xl"
            fontWeight="600"
            color={Colors.text}
            mt={4}
          >
            {selectedCoin}
          </Text>
        </Box>

        <Box
          bg={Colors.surface}
          p={5}
          borderRadius={12}
          w="100%"
          shadow={2}
          borderWidth={1}
          borderColor={Colors.border}
        >
          <Text color={Colors.text} fontSize="lg" fontWeight="600" mb={3}>
            Boost Mining Speed
          </Text>
          <Text color={Colors.textSecondary} fontSize="sm" mb={4}>
            Watch an ad to increase your mining speed by 3 GH/s!
          </Text>
          <Pressable
            onPress={handleWatchAd}
            bg={Colors.primary}
            borderRadius={8}
            p={3}
            alignItems="center"
            _pressed={{ bg: Colors.secondary }}
          >
            <Text color={Colors.buttonText} fontSize="md" fontWeight="600">
              Watch Ad
            </Text>
          </Pressable>
        </Box>

        <HStack justifyContent="space-between" w="100%" flexWrap="wrap">
          <Box
            bg={Colors.surface}
            p={4}
            borderRadius={12}
            w="48%"
            mb={3}
            shadow={2}
            borderWidth={1}
            borderColor={Colors.border}
          >
            <Text color={Colors.textSecondary} fontSize="sm" fontWeight="500">
              Mining Speed
            </Text>
            <Text color={Colors.primary} fontSize="lg" fontWeight="700">
              {miningSpeed} GH/s
            </Text>
          </Box>
          <Box
            bg={Colors.surface}
            p={4}
            borderRadius={12}
            w="48%"
            mb={3}
            shadow={2}
            borderWidth={1}
            borderColor={Colors.border}
          >
            <Text color={Colors.textSecondary} fontSize="sm" fontWeight="500">
              Mined Amount
            </Text>
            <Text color={Colors.primary} fontSize="lg" fontWeight="700">
              {displayedMinedAmount.toFixed(12)} {selectedCoin}
            </Text>
          </Box>
          <Box
            bg={Colors.surface}
            p={4}
            borderRadius={12}
            w="48%"
            mb={3}
            shadow={2}
            borderWidth={1}
            borderColor={Colors.border}
          >
            <Text color={Colors.textSecondary} fontSize="sm" fontWeight="500">
              Uptime
            </Text>
            <Text color={Colors.primary} fontSize="lg" fontWeight="700">
              {formatUptime(uptime)}
            </Text>
          </Box>
          <Box
            bg={Colors.surface}
            p={4}
            borderRadius={12}
            w="48%"
            mb={3}
            shadow={2}
            borderWidth={1}
            borderColor={Colors.border}
          >
            <Text color={Colors.textSecondary} fontSize="sm" fontWeight="500">
              Network Difficulty
            </Text>
            <Text color={Colors.primary} fontSize="lg" fontWeight="700">
              88.1 T
            </Text>
          </Box>
        </HStack>

        <Box
          bg={Colors.surface}
          p={5}
          borderRadius={12}
          w="100%"
          shadow={2}
          borderWidth={1}
          borderColor={Colors.border}
        >
          <Text color={Colors.text} fontSize="lg" fontWeight="600">
            Wallet Balance
          </Text>
          <Text color={Colors.primary} fontSize="2xl" fontWeight="700" mt={2}>
            {displayedMinedAmount.toFixed(8)} {selectedCoin}
          </Text>
        </Box>

        <Box
          bg={Colors.surface}
          p={5}
          borderRadius={12}
          w="100%"
          shadow={2}
          borderWidth={1}
          borderColor={Colors.border}
        >
          <Text color={Colors.text} fontSize="lg" fontWeight="600" mb={3}>
            Invite Friends
          </Text>
          <Text color={Colors.textSecondary} fontSize="sm" mb={4}>
            Share your referral code to earn bonus mining rewards!
          </Text>
          <HStack
            bg={Colors.background}
            borderRadius={8}
            p={3}
            justifyContent="space-between"
            alignItems="center"
            borderWidth={1}
            borderColor={Colors.border}
          >
            <Text color={Colors.text} fontSize="md" fontWeight="600">
              {referralCode}
            </Text>
            <Pressable
              onPress={handleCopyReferral}
              bg={isCopied ? Colors.success : Colors.primary}
              borderRadius={6}
              p={2}
              px={4}
              _pressed={{ bg: Colors.secondary }}
            >
              <Text color={Colors.buttonText} fontSize="sm" fontWeight="600">
                {isCopied ? 'Copied!' : 'Copy'}
              </Text>
            </Pressable>
          </HStack>
        </Box>

        <Box w="100%">
          <Text color={Colors.text} fontSize="lg" fontWeight="600" mb={3}>
            Recent Transactions
          </Text>
          <VStack space={2}>
            {[1, 2, 3].map((_, index) => (
              <Box
                key={index}
                bg={Colors.surface}
                p={4}
                borderRadius={12}
                shadow={1}
                borderWidth={1}
                borderColor={Colors.border}
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <Text color={Colors.textSecondary} fontSize="sm" fontWeight="500">
                    Mined {selectedCoin}
                  </Text>
                  <Text color={Colors.success} fontSize="sm" fontWeight="600">
                    +0.00000001 {selectedCoin}
                  </Text>
                </HStack>
                <Text color={Colors.muted} fontSize="xs" mt={1}>
                  {new Date().toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
};

export default Home;