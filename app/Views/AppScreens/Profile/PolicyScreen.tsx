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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            {'\n\n'}
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            {'\n\n'}
            We collect personal information such as your name, email, and profile image to provide a personalized experience. Your data is securely stored and never shared with third parties without your consent.
            {'\n\n'}
            For more details, please contact our support team at support@example.com.
          </Text>
        </Box>
      </VStack>
    </ScrollView>
  );
};

export default PolicyScreen;