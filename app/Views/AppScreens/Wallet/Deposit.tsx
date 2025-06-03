import React, { useState } from 'react';
import { VStack, Box, Text, Input, Button, Icon, FormControl, WarningOutlineIcon } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../../Colors/Color';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

const Deposit = () => {
  const { selectedCoin } = useSelector((state: RootState) => state.coin);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState({ amount: '', walletAddress: '' });

  const validate = () => {
    let isValid = true;
    const newError = { amount: '', walletAddress: '' };

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newError.amount = 'Please enter a valid amount';
      isValid = false;
    }
    if (!walletAddress || walletAddress.length < 10) {
      newError.walletAddress = 'Please enter a valid wallet address';
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleDeposit = () => {
    if (validate()) {
      console.log(`Depositing ${amount} ${selectedCoin} to ${walletAddress}`);
      // Add your deposit logic here
    }
  };

  return (
    <VStack flex={1} bg={Colors.background} px={4} pt={8} space={6}>
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
        <Text fontSize="2xl" fontWeight="700" color={Colors.buttonText}>
          Deposit {selectedCoin}
        </Text>
      </LinearGradient>

      {/* Deposit Form */}
      <Box
        bg={Colors.surface}
        p={4}
        borderRadius={12}
        shadow={2}
        borderWidth={1}
        borderColor={Colors.border}
      >
        <VStack space={4}>
          <FormControl isInvalid={!!error.amount}>
            <FormControl.Label>
              <Text fontSize="md" fontWeight="600" color={Colors.text}>
                Amount ({selectedCoin})
              </Text>
            </FormControl.Label>
            <Input
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              bg={Colors.inputBackground}
              borderColor={Colors.border}
              color={Colors.text}
              fontSize="md"
              _focus={{
                borderColor: Colors.accent,
                bg: Colors.inputBackground,
              }}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {error.amount}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!error.walletAddress}>
            <FormControl.Label>
              <Text fontSize="md" fontWeight="600" color={Colors.text}>
                Wallet Address
              </Text>
            </FormControl.Label>
            <Input
              placeholder="Enter wallet address"
              value={walletAddress}
              onChangeText={setWalletAddress}
              bg={Colors.inputBackground}
              borderColor={Colors.border}
              color={Colors.text}
              fontSize="md"
              _focus={{
                borderColor: Colors.accent,
                bg: Colors.inputBackground,
              }}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {error.walletAddress}
            </FormControl.ErrorMessage>
          </FormControl>

          <Button
            onPress={handleDeposit}
            bg={Colors.primary}
            _pressed={{ opacity: 0.7 }}
            borderRadius={12}
            leftIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="arrow-down-bold"
                size={5}
                color={Colors.buttonText}
              />
            }
          >
            <Text fontSize="md" fontWeight="600" color={Colors.buttonText}>
              Confirm Deposit
            </Text>
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
};

export default Deposit;