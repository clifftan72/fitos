import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/useAppStore';
import { Goal } from '@/types';
import { colors } from '@/constants/theme';

const GOALS: { value: Goal; emoji: string; label: string; sub: string }[] = [
  { value: 'fat_loss',         emoji: '🔥', label: 'Lose fat',           sub: 'Burn body fat and feel lighter' },
  { value: 'muscle_gain',      emoji: '💪', label: 'Build muscle',        sub: 'Get stronger and add lean mass' },
  { value: 'posture',          emoji: '🧘', label: 'Fix my posture',      sub: 'Reduce pain and stand taller' },
  { value: 'general_health',   emoji: '❤️', label: 'General health',      sub: 'Move more, feel better overall' },
  { value: 'injury_recovery',  emoji: '🩹', label: 'Recover from injury', sub: 'Rebuild safely and rehab smart' },
];

export default function StepGoalsScreen() {
  const { user } = useAppStore();
  const [selected, setSelected] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!selected || !user) return;
    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({ primary_goal: selected })
        .eq('id', user.id);
      router.push('/onboarding/step-2-body');
    } catch {
      // continue anyway — goal can be updated later
      router.push('/onboarding/step-2-body');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-10 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View className="flex-row gap-1.5 mb-8">
          <View className="flex-1 h-1 rounded-full bg-green" />
          <View className="flex-1 h-1 rounded-full bg-border" />
          <View className="flex-1 h-1 rounded-full bg-border" />
        </View>

        <Text className="text-3xl font-bold text-dark mb-2">
          What&apos;s your main goal?
        </Text>
        <Text className="text-base text-muted mb-8">
          We&apos;ll tailor your entire experience around this.
        </Text>

        <View className="gap-3 mb-8">
          {GOALS.map((goal) => {
            const active = selected === goal.value;
            return (
              <TouchableOpacity
                key={goal.value}
                className={`flex-row items-center p-4 rounded-2xl border-2 ${
                  active ? 'border-green bg-green-light' : 'border-border bg-white'
                }`}
                onPress={() => setSelected(goal.value)}
                activeOpacity={0.8}
              >
                <Text className="text-2xl mr-4">{goal.emoji}</Text>
                <View className="flex-1">
                  <Text className={`text-base font-semibold ${active ? 'text-green-dark' : 'text-dark'}`}>
                    {goal.label}
                  </Text>
                  <Text className="text-sm text-muted mt-0.5">{goal.sub}</Text>
                </View>
                {active && (
                  <View className="w-5 h-5 rounded-full bg-green items-center justify-center ml-2">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${selected ? 'bg-green' : 'bg-green-light'}`}
          onPress={handleContinue}
          disabled={!selected || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className={`text-base font-semibold ${selected ? 'text-white' : 'text-green-dark'}`}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
