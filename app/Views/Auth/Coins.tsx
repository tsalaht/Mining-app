import React from 'react';
import { VStack, Box, Text, Pressable, Image } from 'native-base';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { setSelectedCoin } from '../../../store/coinSlice';
import { setPassHome } from '../../../store/PassHomeSlice';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../Colors/Color';
import { AuthStackParamList } from './Index';
import { ImageSourcePropType } from 'react-native';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Coins'>;

interface Coin {
  name: string;
  symbol: string;
  image: ImageSourcePropType;
}

const Coins = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  const handleCoinSelect = (coin: string) => {
    dispatch(setSelectedCoin(coin));
    dispatch(setPassHome(true));
  };

  const coins: Coin[] = [
    { name: 'Bitcoin', symbol: 'BTC', image: require('../../../assets/Coins/Bitcoin.jpg') },
    { name: 'Nexa', symbol: 'NX', image: require('../../../assets/Coins/Nexa.jpg') },
    { name: 'Maker', symbol: 'MKR', image: require('../../../assets/Coins/Maker.jpg') },
    { name: 'Ethereum', symbol: 'ETH', image: require('../../../assets/Coins/Ethereum.jpg') },
    { name: 'Ruby', symbol: 'RUY', image: require('../../../assets/Coins/Ruby.jpg') },
  ];

  return (
    <VStack
      flex={1}
      bg={Colors.background}
      px={5}
      space={2}
      justifyContent="center"
    >
      <Text
        fontSize="4xl"
        fontWeight="bold"
        color={Colors.text}
        textAlign="center"
        mb={4}
      >
        Select a Coin to Mine
      </Text>
      {coins.map((coin, index) => (
        <Pressable
          key={index}
          onPress={() => handleCoinSelect(coin.symbol)}
          w="100%"
          mb={1}
          borderRadius={12}
          overflow="hidden"
          shadow={8}
          _pressed={{ opacity: 0.7 }}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}
          >
            <Image
              source={coin.image}
              alt={coin.name}
              size="xl"
              resizeMode="cover"
              height={120}
              width={120}
              rounded={'full'}
            />
            <Text
              color={Colors.buttonText}
              fontSize="2xl"
              fontWeight="bold"
              mt={3}
            >
              {coin.name}
            </Text>
            <Text color={Colors.textSecondary} fontSize="xl" mt={1}>
              {coin.symbol}
            </Text>
          </LinearGradient>
        </Pressable>
      ))}
    </VStack>
  );
};

export default Coins;