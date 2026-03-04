import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ScrollView, Image, Pressable, Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "expo-router";
import HomeBar from "@/components/HomeBar";
import LogoHeader from "@/components/LogoHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import { theme } from "@/constants/theme";
import Icon from 'assets/icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile, getUserImageSrc } from "@/services/imageService";
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
} from "@/components/ui/form-control";

const EditProfile = () => {
  const { user, userData, updateUserData } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    username: "",
    phoneNumber: "",
    address: "",
    bio: "",
    image: "",
  });

  const initialized = useRef(false);

  // ✅ userData is now the flat profile object, no .data nesting
  useEffect(() => {
    if (userData && !initialized.current) {
      initialized.current = true;
      setUserDetails({
        name: userData.name ?? "",
        username: userData.username ?? "",
        phoneNumber: userData.phoneNumber ?? "",
        address: userData.address ?? "",
        bio: userData.bio ?? "",
        image: userData.image ?? "",
      });
    }
  }, [userData]);

  const handleChange = (key: string, value: string) => {
    setUserDetails((prev) => ({ ...prev, [key]: value }));
  };

  const onPickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos to pick an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    if (result.canceled) return;

    const pickedAsset = result.assets[0];
    setUploadingImage(true);
    handleChange("image", pickedAsset.uri);

    const imageRes = await uploadFile("profiles", pickedAsset.uri, true);

    if (imageRes.success) {
      handleChange("image", imageRes.data);
    } else {
      handleChange("image", userData?.image ?? ""); // ✅ flat, no .data
      Alert.alert("Upload Failed", imageRes.msg);
    }
    setUploadingImage(false);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      await updateUserData(userDetails);
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ flat check, no .data nesting
  if (!user || !userData) {
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
              <Image
                source={getUserImageSrc(userDetails.image)}
                style={styles.avatar}
              />
              <Pressable style={styles.editIcon} onPress={onPickImage} disabled={uploadingImage}>
                <Icon name="camera" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
              </Pressable>
            </View>
          </Card>

          {/* Bio */}
          <Card style={styles.sectionCard}>
            <FormControl className="w-full">
              <FormControlLabel>
                <FormControlLabelText>Bio</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Enter your bio"
                  value={userDetails.bio}
                  onChangeText={(value) => handleChange("bio", value)}
                  multiline
                />
              </Input>
            </FormControl>
          </Card>

          {/* Account Info */}
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
                      <Icon name={field.icon} strokeWidth={2} size={20} color={theme.colors.onSecondary} />
                    </InputIcon>
                  </InputSlot>
                  <InputField
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    value={userDetails[field.key]}
                    onChangeText={(value) => handleChange(field.key, value)}
                    keyboardType={field.keyboardType ?? "default"}
                  />
                </Input>
              </FormControl>
            ))}
          </Card>

          {/* Actions */}
          <Card style={styles.sectionCard}>
            <Button onPress={saveChanges} style={styles.saveButton} disabled={saving || uploadingImage}>
              <ButtonText>{saving ? "Saving..." : "Save Changes"}</ButtonText>
            </Button>
            <Button onPress={() => router.back()} style={styles.cancelButton} disabled={saving}>
              <ButtonText>Cancel</ButtonText>
            </Button>
          </Card>

        </ScrollView>
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
    paddingBottom: 100,
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
  sectionCard: {
    padding: 16,
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
    backgroundColor: theme.colors.onSecondary,
  },
  cancelButton: {
    marginTop: 8,
    backgroundColor: theme.colors.secondary,
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