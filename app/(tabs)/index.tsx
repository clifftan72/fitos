import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/constants/theme';

export default function HomeScreen() {
  const { profile, signOut } = useAuth();
  const name = profile?.display_name ?? 'there';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-6 pt-4">
        <Text className="text-3xl font-bold text-dark">
          {greeting}, {name} 👋
        </Text>
        <Text className="text-base text-muted mt-1 mb-8">
          Dashboard coming in Phase G
        </Text>

        <View className="bg-green-light rounded-2xl p-5 mb-4">
          <Text className="text-lg font-semibold text-green-dark mb-1">
            Complete your first body scan
          </Text>
          <Text className="text-sm text-body mb-4">
            2 minutes to your personalised plan.
          </Text>
          <TouchableOpacity
            className="bg-green rounded-xl py-3 px-5 self-start"
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/scan')}
          >
            <Text className="text-base font-semibold text-white">Start scan</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="border border-border rounded-xl py-4 items-center mt-auto"
          onPress={signOut}
          activeOpacity={0.8}
        >
          <Text className="text-sm font-medium text-muted">Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
