import { Slot, useRouter, Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const _layout = () => (
  <AuthProvider>
    <GluestackUIProvider>
      <MainLayout />
    </GluestackUIProvider>
  </AuthProvider>
);

export default _layout;

function MainLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Wait for layout to mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // don't navigate before mount

    if (user) {
      router.replace("/home");
    } else {
      router.replace("/welcome");
    }
  }, [user, mounted]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(main)/postDetails"
        options={{
          presentation: "modal",
          headerShown: false, // modal still needs this or it shows a default header
        }}
      />
    </Stack>
);
}


