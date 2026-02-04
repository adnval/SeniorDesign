import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function About() {
  return (
    <View className="flex-1 justify-center items-center bg-base-100">
      <Text className="text-3xl font-bold text-primary">About Page</Text>
      <Link href="/" className="text-accent mt-4">Go back home</Link>
    </View>
  );
}