import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "expo-router";
import HomeBar from "@/components/HomeBar";

const Profile = () => {
  const { user, userData, signOutUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Wait for userData to be fetched
  useEffect(() => {
    if (userData) setLoading(false);
  }, [userData]);

  const handleSignOut = async () => {
    await signOutUser();
    router.replace("/welcome");
  };

  if (!user || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text size="lg">Loading profile...</Text>
      </View>
    );
  }

  const profile = userData?.data ?? {};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: profile.image || "https://via.placeholder.com/100",
              }}
              style={styles.avatar}
            />
          </View>
          <Text size="xl" bold style={styles.name}>
            {profile.name || "Your Name"}
          </Text>
          {profile.email && (
            <Text style={styles.username}>{profile.email}</Text>
          )}
        </Card>

        {/* Contact & Info Section */}
        <Card style={styles.sectionCard}>
          <Text size="lg" bold style={styles.sectionTitle}>
            Contact & Info
          </Text>
          <Text style={styles.detail}>
            Phone: {profile.phoneNumber ?? "N/A"}
          </Text>
          <Text style={styles.detail}>Address: {profile.address ?? "N/A"}</Text>
          <Text style={styles.detail}>Bio: {profile.bio ?? "N/A"}</Text>
          <Text style={styles.detail}>
            Account created: {new Date(profile.created_at).toLocaleDateString()}
          </Text>
        </Card>

        {/* Actions Section */}
        <Card style={styles.sectionCard}>
          <Text size="lg" bold style={styles.sectionTitle}>
            Actions
          </Text>
          <Button onPress={handleSignOut} style={styles.logoutButton}>
            <ButtonText>Log out</ButtonText>
          </Button>
        </Card>
      </ScrollView>

      {/* Home Bar fixed at bottom */}
      <HomeBar active="profile" />
    </View>
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
  },
});
