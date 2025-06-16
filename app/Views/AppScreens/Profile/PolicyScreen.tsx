import React from 'react';
import { VStack, Box, Text, ScrollView } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../../Colors/Color';

const PolicyScreen = () => {
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
            Privacy Policy
          </Text>
        </LinearGradient>

        {/* Policy Content */}
        <Box
          bg={Colors.surface}
          p={5}
          borderRadius={12}
          shadow={2}
          borderWidth={1}
          borderColor={Colors.border}
          w="100%"
        >
          <Text
            fontSize="lg"
            fontWeight="600"
            color={Colors.text}
            mb={4}
          >
            Our Commitment to Privacy
          </Text>
          <Text fontSize="md" color={Colors.textSecondary} lineHeight="lg">
            Welcome to our Cryptocurrency Nexa clicker App. This privacy policy explains how we collect, use, and protect your information while you use our mining platform.
            {'\n\n'}
            Information We Collect:
            {'\n'}
            • Account Information: Email, username, and password
            {'\n'}
            • Mining Data: Mining rates, coin balances, and transaction history
            {'\n'}
            • Device Information: Device type, operating system, and app usage statistics
            {'\n\n'}
            How We Use Your Information:
            {'\n'}
            • To provide and maintain our mining services
            {'\n'}
            • To process your mining rewards and transactions
            {'\n'}
            • To improve our app's performance and user experience
            {'\n'}
            • To communicate important updates about our services
            {'\n\n'}
            Data Security:
            {'\n'}
            We implement industry-standard security measures to protect your personal information and mining data. Your mining rewards and transactions are secured using advanced encryption technologies.
            {'\n\n'}
            Mining and Rewards:
            {'\n'}
            • Nexa clicker rates and rewards are calculated based on your account level and mining speed
            {'\n'}
            • All mining transactions are recorded on the blockchain
            {'\n'}
            • Rewards are distributed according to our mining algorithm
            {'\n\n'}
            Your Rights:
            {'\n'}
            • Access your mining data and transaction history
            {'\n'}
            • Update your account information
            {'\n'}
            • Withdraw your mining rewards
            {'\n'}
            • Delete your account and associated data
            {'\n\n'}
            For any questions about our privacy policy or Nexa clicker services, please contact our support team at support@crypt0.rayyehbalak.com
          </Text>
        </Box>
      </VStack>
    </ScrollView>
  );
};

export default PolicyScreen;