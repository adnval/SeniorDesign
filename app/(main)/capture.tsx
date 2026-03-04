import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import HomeBar from "@/components/HomeBar";
import { styles } from "constants/theme";
import { hp } from "@/helpers/common";
import Icon from "assets/icons";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

const Capture = () => {
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function handleCapture() {
    if (!cameraRef.current || !ready) {
      console.log("Camera not ready:", { ref: !!cameraRef.current, ready });
      return;
    }
    console.log("Taking picture...");
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    console.log("Photo result:", photo);
    if (photo?.uri) {
      console.log("Navigating to preview with URI:", photo.uri);
      router.push({ pathname: "/preview", params: { uri: photo.uri } });
    }
  }

  async function handlePickMedia() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      router.push({
        pathname: "/preview",
        params: {
          uri: asset.uri,
          type: asset.type ?? 'image', // 'image' or 'video'
        },
      });
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Checking camera permissions…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera access is required to continue</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        onCameraReady={() => setReady(true)}
      />

      <View style={cameraStyles.buttonContainer}>
        <TouchableOpacity
          style={cameraStyles.sideButton}
          onPress={toggleCameraFacing}
          activeOpacity={0.7}
        >
          <Icon name="cameraFlip" size={24} strokeWidth={2} color={theme.colors.onPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[cameraStyles.captureButton, !ready && { opacity: 1 }]}
          activeOpacity={1}
          onPress={handleCapture}
          disabled={!ready}
        >
          <Icon name="camera" size={32} strokeWidth={2} color={theme.colors.onPrimary} />
        </TouchableOpacity>

        <TouchableOpacity style={cameraStyles.sideButton} activeOpacity={0.7} onPress={handlePickMedia}>
          <Icon name="image" size={24} strokeWidth={2} color={theme.colors.onPrimary} />
        </TouchableOpacity>
      </View>

      <HomeBar active="capture" />
    </View>
  );
};

export default Capture;

const cameraStyles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: hp(13),
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 48,
  },
  sideButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
