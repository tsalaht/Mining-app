import React, { useState, useEffect, useRef } from 'react';
import {
  VStack,
  Box,
  Text,
  Pressable,
  Image,
  ScrollView,
  Spinner,
  AlertDialog,
} from 'native-base';
import { TextInput, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../../Colors/Color';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from '../../../../store/userSlice';
import { userService } from '../../../services/api';

type RootStackParamList = {
  Login: undefined;
  EditProfileScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EditProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { name, email, profileImage } = useSelector(
    (state: RootState) => state.user
  );
  const [newName, setNewName] = useState(name || '');
  const [newEmail, setNewEmail] = useState(email || '');
  const [newImage, setNewImage] = useState(profileImage || '');
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const cancelRef = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await userService.getProfile();
      setNewName(userData.username);
      setNewEmail(userData.email);
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    if (!newName || !newEmail) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await userService.updateProfile(newName, newEmail);
      dispatch(
        updateProfile({
          name: newName,
          email: newEmail,
          profileImage: newImage,
        })
      );
      navigation.goBack();
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await userService.deleteAccount();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <Box flex={1} bg={Colors.background} justifyContent="center" alignItems="center">
        <Spinner size="lg" color={Colors.primary} />
      </Box>
    );
  }

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
              Username
            </Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your username"
              placeholderTextColor={Colors.text + '80'}
              style={styles.input}
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
            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Enter your email"
              placeholderTextColor={Colors.text + '80'}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
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

        {/* Delete Account Button */}
        <Pressable
          onPress={() => setShowDeleteDialog(true)}
          _pressed={{ opacity: 0.7 }}
          w="100%"
        >
          <Box
            bg={Colors.danger}
            borderRadius={12}
            padding={16}
            alignItems="center"
          >
            <Text
              fontSize="lg"
              fontWeight="600"
              color={Colors.buttonText}
            >
              Delete Account
            </Text>
          </Box>
        </Pressable>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <AlertDialog.Content>
            <AlertDialog.Header>Delete Account</AlertDialog.Header>
            <AlertDialog.Body>
              Are you sure you want to delete your account? This action cannot be undone.
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Pressable
                ref={cancelRef}
                onPress={() => setShowDeleteDialog(false)}
                _pressed={{ opacity: 0.7 }}
                mr={3}
              >
                <Text color={Colors.text}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDeleteAccount}
                _pressed={{ opacity: 0.7 }}
              >
                <Text color={Colors.danger}>Delete</Text>
              </Pressable>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    color: Colors.text,
    fontSize: 16,
  },
});

export default EditProfileScreen;