import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Icon from "assets/icons";

const Preview = () => {
    const { uri, type } = useLocalSearchParams();  
    const router = useRouter();

    function handlePress() {
        console.log("Navigating to CreatePost with uri:", uri, "and type:", type);
        router.push({ pathname: "/CreatePost", params: { uri, type } });
    }

  return (
    <View style={styles.container}>
      {/* Full-screen image preview */}
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />

      {/* Top bar */}
      <SafeAreaView edges={["top"]} style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Icon name="arrowLeft" size={24} strokeWidth={2} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom actions */}
      <SafeAreaView edges={["bottom"]} style={styles.bottomBar}>
        <TouchableOpacity style={styles.discardBtn} onPress={() => router.back()}>
          <Icon name="delete" size={20} strokeWidth={2} color="#fff" />
          <Text style={styles.discardText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.useBtn}
          onPress={() => handlePress()}
        >
          <Text style={styles.useText}>Use Photo</Text>
          <Icon name="plus" size={20} strokeWidth={2} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    flex: 1,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(4),
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(6),
    paddingTop: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  discardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.lg,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  discardText: {
    color: "#fff",
    fontSize: hp(1.8),
    fontWeight: "600",
  },
  useBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
  },
  useText: {
    color: "#fff",
    fontSize: hp(1.8),
    fontWeight: "600",
  },
});