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

const Profile = () => {
  const { user, userData, signOutUser, setAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Wait for userData to be fetched
  useEffect(() => {
    console.log("userData changed:", userData);
    if (userData) setLoading(false);
  }, [userData]);

  const handleSignOut = async () => {
    console.log("Signing out user...");
    Alert.alert('Confirm Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Sign out cancelled'),
        style:'cancel',
      },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await signOutUser();
            console.log("User signed out successfully");
            router.replace("/welcome");
          } catch (error) {
            console.error("Error signing out:", error);
            Alert.alert('Error', 'An error occurred while signing out. Please try again.');
          }
        },
        style:'destructive',
      },
    ]);
  };

  if (!user || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text size="lg">Loading profile...</Text>
      </View>
    );
  }

  // Move profile definition here so it updates with userData changes
  const profile = userData?.data ?? userData ?? {};
  console.log("Rendering profile for user:", profile);

  return (
    <ScreenWrapper bg="white">
      <LogoHeader title="Profile"/>
    <View style={styles.container}>
      {/* <LogoHeader /> */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={profile?.image ?? undefined}
              size={100}
              rounded={50}
            />
            <Pressable style={styles.editIcon} onPress={()=> router.push('/editProfile')}>
              <Icon name="edit" strokeWidth={2} size={20} color={theme.colors.onSecondary}/>
            </Pressable>
          </View>
          <Text size="xl" bold style={styles.name}>
            {profile.name || "Your Name"}
          </Text>
          {profile.username && (
            <Text style={styles.username}>{profile.username}</Text>
          )}
        </Card>

        <Card style={styles.sectionCard}>
          <Text size="lg" bold style={styles.sectionTitle}>
            Bio
          </Text>
          <View style={styles.infoRow}>
            <Icon name="user" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
            <Text style={styles.detail}>
              {profile.bio ?? "N/A"}
            </Text>
          </View>
          </Card>

        {/* Contact & Info Section */}
        <Card style={styles.sectionCard}>
          <Text size="lg" bold style={styles.sectionTitle}>
            Account Info
          </Text>

          <View style={styles.infoRow}>
            <Icon name="call" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
            <Text style={styles.detail}>
              Phone: {profile.phoneNumber ?? "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="location" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
            <Text style={styles.detail}>
              Address: {profile.address ?? "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="mail" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
            <Text style={styles.detail}>
              Email: {profile.email ?? "N/A"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="lock" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
            <Text style={styles.detail}>
              Account created:{" "}
              {profile.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </Card>


        {/* Actions Section */}
        <Card style={styles.sectionCard}>
          <Text size="lg" bold style={styles.sectionTitle}>
            Actions
          </Text>
          <Button onPress={() => router.push('/editProfile')} style={styles.logoutButton}>
            <ButtonText>Edit Profile</ButtonText>
          </Button>
          <Button onPress={handleSignOut} style={styles.logoutButton}>
            <ButtonText>Log out</ButtonText>
          </Button>
        </Card>
      </ScrollView>

      {/* Home Bar fixed at bottom */}
      <HomeBar active="profile" />
    </View>
    </ScreenWrapper>
  );
};

export default Profile;

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
