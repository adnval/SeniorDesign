import { View, Text, Pressable, Button } from 'react-native';
import { Link, useRouter } from 'expo-router';
import '../global.css';
import ScreenWrapper from 'components/ScreenWrapper';

export default function Home() {
  const router = useRouter();
  return (
    <ScreenWrapper>
    <View className="flex-1 justify-center items-center bg-base-100">
      <Text className="text-4xl font-bold text-primary mb-4">Home</Text>
      
        <Pressable className="btn btn-primary" onPress={() => router.push('/welcome')}>
          <Text className="text-primary-content">Go to About</Text>
        </Pressable>
      
      <Link href="/profile" asChild>
        <Pressable className="btn btn-secondary mt-4">
          <Text className="text-secondary-content">Go to Profile</Text>
        </Pressable>
      </Link>
    </View>
    </ScreenWrapper>
  );
}