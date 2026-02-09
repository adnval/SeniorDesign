import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Image, Pressable } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "expo-router";
import HomeBar from "@/components/HomeBar";
import LogoHeader from "@/components/LogoHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import Avatar from "@/components/Avatar";
import { Alert } from "react-native";
import {theme} from "@/constants/theme";
import Icon from 'assets/icons'
import * as ImagePicker from 'expo-image-picker';

import {
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from "@/components/ui/input";

import { 
  FormControl, 
  FormControlLabel, 
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText
} from "@/components/ui/form-control";
import { getUserImageSrc } from "@/services/imageService";

const EditProfile = () => {
  const { user, userData, updateUserData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Single state object for all editable fields
  const [userDetails, setUserDetails] = useState({
    name: "",
    username: "",
    phoneNumber: "",
    address: "",
    bio: "",
    image: "",
  });

  // Populate the form with current user data
  // Populate the form with current user data
useEffect(() => {
  if (userData?.data) {
    setUserDetails({
      name: userData.data.name ?? "",
      username: userData.data.username ?? "",
      phoneNumber: userData.data.phoneNumber ?? "",
      address: userData.data.address ?? "",
      bio: userData.data.bio ?? "",
      image: userData.data.image ?? "",
    });
    setLoading(false);
  }
}, [userData]);

  const saveChanges = async () => {
    try {
      let updatedDetails = { ...userDetails };
      
      // If image is an object (newly picked), you may need to upload it first
      // Uncomment and implement this if you have an upload function
      // if (userDetails.image && typeof userDetails.image === 'object') {
      //   const imageUrl = await uploadImage(userDetails.image);
      //   updatedDetails.image = imageUrl;
      // }
      
      await updateUserData(updatedDetails);
      Alert.alert("Success", "Profile updated successfully!");
      router.back(); // Navigate back to Profile
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const cancelChanges = () => router.back();

  const onPickImage = async () => {
    console.log("Requesting media library permissions...");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your photos to pick an image.');
        return;
    }

    console.log("Launching image library...");

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.7,
    });

    if (!result.canceled) {
        // Store the asset object temporarily for display
        setUserDetails((prev) => ({ ...prev, image: result.assets[0]}));
    }
  };

  // Determine the correct image source
  let imageSource;
  if (userDetails.image) {
    if (typeof userDetails.image === 'object' && userDetails.image.uri) {
      // Newly picked image
      imageSource = { uri: userDetails.image.uri };
    } else if (typeof userDetails.image === 'string') {
      // Existing image URL
      imageSource = getUserImageSrc(userDetails.image);
    } else {
      // Fallback
      imageSource = getUserImageSrc(userDetails.image);
    }
  }

  if (!user || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text size="lg">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <LogoHeader title="Edit Profile" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Picture */}
          <Card style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.editIcon} onPress={onPickImage}>
                <Icon name="camera" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
              </Pressable>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <FormControl key={"bio"} className="w-full">
                <FormControlLabel>
                  <FormControlLabelText>{"Bio"}</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder={`Enter your bio`}
                    value={userDetails["bio"]}
                    onChangeText={(value) =>
                      setUserDetails((prev) => ({ ...prev, bio: value }))
                    }
                    multiline={true}
                  />
                </Input>
              </FormControl>
          </Card>

          {/* Account Info Inputs */}
          <Card style={styles.sectionCard}>
            {[
              { label: "Name", key: "name", icon: "user" },
              { label: "Username", key: "username", icon: "user" },
              { label: "Phone Number", key: "phoneNumber", icon: "call", keyboardType: "phone-pad" },
              { label: "Address", key: "address", icon: "location" },
            ].map((field) => (
              <FormControl key={field.key} className="w-full mt-4">
                <FormControlLabel>
                  <FormControlLabelText>{field.label}</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputSlot>
                    <InputIcon>
                      <Icon
                        name={field.icon}
                        strokeWidth={2}
                        size={20}
                        color={theme.colors.onSecondary}
                      />
                    </InputIcon>
                  </InputSlot>
                  <InputField
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    value={userDetails[field.key]}
                    onChangeText={(value) =>
                      setUserDetails((prev) => ({ ...prev, [field.key]: value }))
                    }
                    keyboardType={field.keyboardType ?? "default"}
                    multiline={field.multiline ?? false}
                  />
                </Input>
              </FormControl>
            ))}
          </Card>

          {/* Actions Section */}
          <Card style={styles.sectionCard}>
            <Button onPress={saveChanges} style={styles.logoutButton}>
              <ButtonText>Save Changes</ButtonText>
            </Button>
            <Button onPress={cancelChanges} style={styles.cancelButton}>
              <ButtonText>Cancel</ButtonText>
            </Button>
          </Card>
        </ScrollView>

        {/* Home Bar fixed at bottom */}
        <HomeBar active="profile" />
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // space for HomeBar
  },
  profileHeader: {
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
  },
  name: {
    textAlign: "center",
  },
  username: {
    textAlign: "center",
    color: "#666",
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  detail: {
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 8,
    backgroundColor: theme.colors.onSecondary,
  },
  cancelButton: {
    marginTop: 8,
    backgroundColor: theme.colors.secondary,
    color: theme.colors.onSecondary,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -9,
    padding: 7,
    borderRadius: 50,
    backgroundColor: theme.colors.onPrimary,
    shadowColor: theme.colors.onSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  infoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginVertical: 6,
  },

});
