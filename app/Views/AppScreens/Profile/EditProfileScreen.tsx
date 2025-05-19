import React, { useState } from 'react';
import {
  VStack,
  Box,
  Text,
  Input,
  Pressable,
  Image,
  ScrollView,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../../Colors/Color';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from '../../../../store/userSlice'; // Assumed action

const EditProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { name, email, profileImage } = useSelector(
    (state: RootState) => state.user
  );
  const [newName, setNewName] = useState(name || '');
  const [newEmail, setNewEmail] = useState(email || '');
  const [newImage, setNewImage] = useState(profileImage || '');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setNewImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!newName || !newEmail) {
      alert('Please fill in all fields');
      return;
    }
    dispatch(
      updateProfile({
        name: newName,
        email: newEmail,
        profileImage: newImage,
      })
    );
    navigation.goBack();
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
            Edit Profile
          </Text>
        </LinearGradient>

        {/* Profile Image */}
        <Pressable onPress={pickImage} _pressed={{ opacity: 0.7 }}>
          <Box position="relative">
    
            <Box
         
           
              bg={Colors.primary}
              borderRadius={20}
              p={2}
            >
              <MaterialCommunityIcons
                name="camera"
                size={20}
                color={Colors.buttonText}
              />
            </Box>
          </Box>
        </Pressable>

        {/* Input Fields */}
        <VStack space={4} w="100%">
          <Box>
            <Text
              fontSize="md"
              fontWeight="600"
              color={Colors.text}
              mb={2}
            >
              Name
            </Text>
            <Input
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your name"
              bg={Colors.surface}
              borderColor={Colors.border}
              borderWidth={1}
              borderRadius={12}
              p={3}
              color={Colors.text}
              _focus={{
                borderColor: Colors.accent,
                bg: Colors.surface,
              }}
            />
          </Box>
          <Box>
            <Text
              fontSize="md"
              fontWeight="600"
              color={Colors.text}
              mb={2}
            >
              Email
            </Text>
            <Input
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Enter your email"
              bg={Colors.surface}
              borderColor={Colors.border}
              borderWidth={1}
              borderRadius={12}
              p={3}
              color={Colors.text}
              keyboardType="email-address"
              _focus={{
                borderColor: Colors.accent,
                bg: Colors.surface,
              }}
            />
          </Box>
        </VStack>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          _pressed={{ opacity: 0.7 }}
          w="100%"
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            style={{
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
            }}
          >
            <Text
              fontSize="lg"
              fontWeight="600"
              color={Colors.buttonText}
            >
              Save Changes
            </Text>
          </LinearGradient>
        </Pressable>
      </VStack>
    </ScrollView>
  );
};

export default EditProfileScreen;