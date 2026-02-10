import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import HomeBar from "@/components/HomeBar";
import { styles } from "constants/theme";
import { hp } from "@/helpers/common";
import Icon from "assets/icons";
import { theme } from "@/constants/theme";


const Capture = () => {
const [facing, setFacing] = useState<"back" | "front">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);

  function toggleCameraFacing() {
  setFacing((current) => (current === "back" ? "front" : "back"));
}


  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    // Permission hook still loading
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
      {/* Camera preview */}
      <CameraView
        style={{ flex: 1 }}
        facing={facing}
        onCameraReady={() => setReady(true)}
      />
      <View style={cameraStyles.buttonContainer}>
  {/* Left button */}
  <TouchableOpacity
    style={cameraStyles.sideButton}
    onPress={toggleCameraFacing}
    activeOpacity={0.7}
  >
    <Icon
      name="arrowLeft"
      size={24}
      strokeWidth={2}
      color={theme.colors.onPrimary}
    />
  </TouchableOpacity>

  {/* Center camera button */}
  <TouchableOpacity
    style={cameraStyles.captureButton}
    activeOpacity={0.7}
  >
    <Icon
      name="camera"
      size={32}
      strokeWidth={2}
      color={theme.colors.onPrimary}
    />
  </TouchableOpacity>

  {/* Right button (placeholder for later) */}
  <TouchableOpacity
    style={cameraStyles.sideButton}
    activeOpacity={0.7}
  >
    <Icon
      name="image"
      size={24}
      strokeWidth={2}
      color={theme.colors.onPrimary}
    />
  </TouchableOpacity>
</View>


      {/* Bottom nav */}
      <HomeBar active="capture" />
    </View>
  );
};

export default Capture;

const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
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
  backgroundColor: "rgba(0,0,0,0.3)", // optional but 🔥
},

  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});