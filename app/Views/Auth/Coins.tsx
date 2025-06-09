import React, { useEffect, useState } from 'react';
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
import axios from 'axios';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Coins'>;

interface Coin {
  id: number;
  name: string;
  symbol: string;
  image_url: string | null;
  created_at: string;
}

const Coins = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('https://crypt0.rayyehbalak.com/coin');
        console.log('API Response:', response.data);
        setCoins(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCoins();
  }, []);

  const handleCoinSelect = (coin: string) => {
    dispatch(setSelectedCoin(coin));
    dispatch(setPassHome(true));
  };

  const getImageSource = (imageUrl: string | null) => {

      return require('../../../assets/Coins/Bitcoin.jpg');
  };

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
      {coins.map((coin) => {
        console.log('Rendering coin:', coin); // Debug log
        return (
          <Pressable
            key={coin.id}
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
                source={getImageSource(coin.image_url)}
                alt={coin.name}
                size="xl"
                resizeMode="cover"
                height={120}
                width={120}
                rounded={'full'}
                onError={(error) => {
                  console.error('Image loading error:', error.nativeEvent);
                  console.log('Failed to load image for coin:', coin.name);
                  console.log('Image URL:', coin.image_url);
                }}
                onLoad={() => {
                  console.log('Image loaded successfully for coin:', coin.name);
                }}
                fallbackSource={require('../../../assets/Coins/Bitcoin.jpg')}
              />
              <Text
                color="white"
                fontSize="2xl"
                fontWeight="bold"
                mt={3}
              >
                {coin.name}
              </Text>
              <Text color="white" fontSize="xl" mt={1}>
                {coin.symbol}
              </Text>
            </LinearGradient>
          </Pressable>
        );
      })}
    </VStack>
  );
};

export default Coins;