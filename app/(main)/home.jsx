import React from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "expo-router";
import HomeBar from "@/components/HomeBar";

const Home = () => {
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutUser();
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text size="xl" bold>
          Welcome 👋
        </Text>

        <Text style={styles.detail}>
          You are signed in as:
        </Text>

        <Text style={styles.detail}>
          Email: {user?.email ?? "N/A"}
        </Text>

        {user?.id && (
          <Text style={styles.detail}>
            User ID: {user.id}
          </Text>
        )}

        <Button onPress={handleSignOut} style={styles.logoutButton}>
          <ButtonText>Log out</ButtonText>
        </Button>
      </Card>
      <HomeBar active="home" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    padding: 16,
    gap: 8,
  },
  detail: {
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 16,
  },
});
