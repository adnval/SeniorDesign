import { Stack, useRouter } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Text } from "@/components/ui/text";
import "@/global.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Main } from "@expo/html-elements";
import { useEffect, useInsertionEffect } from "react";

const _layout = () => {
  return (
    <AuthProvider>
      <GluestackUIProvider>
        <MainLayout />
      </GluestackUIProvider>
    </AuthProvider>
  );
};

export default _layout;

function MainLayout() {
  const { user, session } = useAuth();
  const router = useRouter();

    useEffect(() => {
    // If user is logged in, navigate to /welcome
    if (user) {
      router.replace("/welcome");
    }
  }, [user, router]);
  return (
    <Main>
      <Stack />
      {!user && (
        <Text
          style={{ fontSize: 18, textAlign: "center", marginTop: 20 }}
        >
          Please log in to continue
        </Text>
      )}  
    </Main>
  );
}
