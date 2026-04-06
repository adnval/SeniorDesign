import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Pressable, Alert } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "expo-router";
import HomeBar from "@/components/HomeBar";
import LogoHeader from "@/components/LogoHeader";
import ScreenWrapper from "@/components/ScreenWrapper";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/theme";
import Icon from 'assets/icons';
import { getFollowCounts } from "@/services/followService";
import { hp } from "@/helpers/common";

const Profile = () => {
  const { user, userData, signOutUser } = useAuth();
  const router = useRouter();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      getFollowCounts(user.id).then(res => {
        if (res.success) {
          setFollowerCount(res.followerCount);
          setFollowingCount(res.followingCount);
        }
      });
    }
  }, [user?.id]);

  const handleSignOut = async () => {
    Alert.alert('Confirm Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            await signOutUser();
            router.replace("/welcome");
          } catch (error) {
            Alert.alert('Error', 'An error occurred while signing out. Please try again.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text size="lg">Not signed in.</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text size="lg">Loading profile...</Text>
      </View>
    );
  }

  const profile = userData ?? {};

  return (
    <ScreenWrapper bg="white">
      <LogoHeader title="Profile" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Profile Header */}
          <Card style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Avatar
                uri={profile?.image ?? undefined}
                size={100}
                rounded={50}
              />
              <Pressable style={styles.editIcon} onPress={() => router.push('/editProfile')}>
                <Icon name="edit" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
              </Pressable>
            </View>
            <Text size="xl" bold style={styles.name}>
              {profile.name || "Your Name"}
            </Text>
            {profile.username && (
              <Text style={styles.username}>{profile.username}</Text>
            )}

            {/* Followers / Following / Posts row */}
            <View style={styles.statsRow}>
              <Pressable
                style={styles.statItem}
                onPress={() => router.push({ pathname: '/followList', params: { userId: user.id, type: 'followers' } })}
              >
                <Text bold style={styles.statNumber}>{followerCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </Pressable>

              <View style={styles.statDivider} />

              <Pressable
                style={styles.statItem}
                onPress={() => router.push({ pathname: '/followList', params: { userId: user.id, type: 'following' } })}
              >
                <Text bold style={styles.statNumber}>{followingCount}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </Pressable>

              <View style={styles.statDivider} />

              <Pressable style={styles.statItem} onPress={() => router.push('/MyPosts')}>
                <Icon name="image" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
                <Text style={styles.statLabel}>My Posts</Text>
              </Pressable>
            </View>
          </Card>

          {/* Bio Section */}
          <Card style={styles.sectionCard}>
            <Text size="lg" bold style={styles.sectionTitle}>Bio</Text>
            <View style={styles.infoRow}>
              <Icon name="user" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
              <Text style={styles.detail}>{profile.bio ?? "N/A"}</Text>
            </View>
          </Card>

          {/* Contact & Info Section */}
          <Card style={styles.sectionCard}>
            <Text size="lg" bold style={styles.sectionTitle}>Account Info</Text>
            <View style={styles.infoRow}>
              <Icon name="call" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
              <Text style={styles.detail}>Phone: {profile.phoneNumber ?? "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="location" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
              <Text style={styles.detail}>Address: {profile.address ?? "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="mail" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
              <Text style={styles.detail}>Email: {profile.email ?? "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="lock" strokeWidth={2} size={20} color={theme.colors.onSecondary} />
              <Text style={styles.detail}>
                Account created:{" "}
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
              </Text>
            </View>
          </Card>

          {/* Actions Section */}
          <Card style={styles.sectionCard}>
            <Text size="lg" bold style={styles.sectionTitle}>Actions</Text>
            <Button onPress={() => router.push('/editProfile')} style={styles.actionButton}>
              <ButtonText>Edit Profile</ButtonText>
            </Button>
            <Button onPress={handleSignOut} style={styles.actionButton}>
              <ButtonText>Log out</ButtonText>
            </Button>
          </Card>

        </ScrollView>
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
  name: {
    textAlign: "center",
  },
  username: {
    textAlign: "center",
    color: "#666",
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 2,
  },
  statNumber: {
    fontSize: hp(2.2),
    color: theme.colors.onSecondary,
  },
  statLabel: {
    fontSize: hp(1.5),
    color: theme.colors.gray,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.surface,
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
    flexShrink: 1,
  },
  actionButton: {
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