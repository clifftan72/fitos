import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/useAppStore';
import { colors } from '@/constants/theme';

const BENEFITS = [
  'Detects postural imbalances from your camera',
  'Generates a corrective program made for you',
  'Tracks your improvement week by week',
];

export default function StepScanPromptScreen() {
  const { user, setProfile, profile } = useAppStore();
  const [loading, setLoading] = useState(false);

  async function completeOnboarding() {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', user.id)
        .select()
        .single();
      if (data) setProfile(data);
    } catch {
      // proceed anyway
    }
  }

  async function handleStartScan() {
    setLoading(true);
    await completeOnboarding();
    router.replace('/(tabs)/scan');
  }

  async function handleSkip() {
    await completeOnboarding();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-10 pb-8 justify-between">
        <View>
          {/* Progress */}
          <View className="flex-row gap-1.5 mb-8">
            <View className="flex-1 h-1 rounded-full bg-green" />
            <View className="flex-1 h-1 rounded-full bg-green" />
            <View className="flex-1 h-1 rounded-full bg-green" />
          </View>

          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <Text className="text-sm text-muted">← Back</Text>
          </TouchableOpacity>

          {/* Illustration placeholder */}
          <View className="bg-green-light rounded-3xl h-52 items-center justify-center mb-8">
            <Text className="text-7xl">🧍</Text>
          </View>

          <Text className="text-3xl font-bold text-dark mb-3">
            Let&apos;s understand your body
          </Text>
          <Text className="text-base text-body leading-relaxed mb-8">
            Your first body scan takes 2 minutes and gives you a personalised
            plan — not a generic one.
          </Text>

          <View className="gap-4 mb-8">
            {BENEFITS.map((benefit) => (
              <View key={benefit} className="flex-row items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-green items-center justify-center mt-0.5">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
                <Text className="flex-1 text-base text-body">{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-3">
          <TouchableOpacity
            className="bg-green rounded-xl py-4 items-center"
            onPress={handleStartScan}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text className="text-base font-semibold text-white">Start my scan</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 items-center"
            onPress={handleSkip}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text className="text-sm text-muted">Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
