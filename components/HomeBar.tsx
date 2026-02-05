import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";

type HomeBarProps = {
  active?: "feed" | "discover" | "capture" | "activity" | "profile";
};

const HomeBar = ({ active = "feed" }: HomeBarProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getColor = (name: string) =>
    active === name ? theme.colors.onPrimary : theme.colors.onSecondary;

    const getStrokeWidth = (activeTab: string, tabName: string) => {
      return activeTab === tabName ? 3.5 : 1.5;
    }

  return (
    <View style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        {/* Feed */}
        <Pressable onPress={() => router.replace("/feed")} style={styles.icon}>
          <Icon name="home" strokeWidth={getStrokeWidth(active, "feed")} color={getColor("feed")} />
        </Pressable>

        {/* Discover */}
        <Pressable
          onPress={() => router.replace("/discover")}
          style={styles.icon}
        >
          <Icon name="search" strokeWidth={getStrokeWidth(active, "discover")} color={getColor("discover")} />
        </Pressable>

        {/* Capture (center, emphasized) */}
        <Pressable
          onPress={() => router.push("/capture")}
          style={styles.captureButton}
        >
          <Icon name="plus" strokeWidth={getStrokeWidth(active, "capture")} size={26} color={theme.colors.primary} />
        </Pressable>

        {/* Activity */}
        <Pressable
          onPress={() => router.replace("/activity")}
          style={styles.icon}
        >
          <Icon name="heart" strokeWidth={getStrokeWidth(active, "activity")} color={getColor("activity")} />
        </Pressable>

        {/* Profile */}
        <Pressable
          onPress={() => router.replace("/home")}
          style={styles.icon}
        >
          <Icon name="user" strokeWidth={getStrokeWidth(active, "home")} color={getColor("profile")} />
        </Pressable>
      </View>
    </View>
  );
};

export default HomeBar;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.primary,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondary,
    backgroundColor: theme.colors.primary,
  },
  icon: {
    padding: 8,
  },
  captureButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.onPrimary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
