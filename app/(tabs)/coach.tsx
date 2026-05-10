import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: implement — Phase F (AI Coach)
export default function CoachScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface items-center justify-center">
      <Text className="text-xl font-semibold text-dark">AI Coach</Text>
      <Text className="text-sm text-muted mt-2">Coming in Phase F</Text>
    </SafeAreaView>
  );
}
