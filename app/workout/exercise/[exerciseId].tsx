import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Exercise } from '@/types';
import { colors } from '@/constants/theme';

const CATEGORY_COLORS: Record<string, string> = {
  corrective: 'bg-green-light text-green-dark',
  mobility:   'bg-blue-50 text-blue-700',
  strength:   'bg-amber-50 text-amber-700',
  cardio:     'bg-red-50 text-red-600',
  recovery:   'bg-purple-50 text-purple-700',
};

export default function ExerciseDetailScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('exercises')
          .select('*')
          .eq('slug', exerciseId)
          .single();
        setExercise(data as Exercise);
      } finally {
        setLoading(false);
      }
    }
    if (exerciseId) load();
  }, [exerciseId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={colors.green} />
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-lg font-semibold text-dark mb-2">Exercise not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-sm text-green">Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const categoryStyle = CATEGORY_COLORS[exercise.category] ?? 'bg-surface text-body';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-green-light px-6 pt-4 pb-8">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-sm text-green-dark">← Back</Text>
          </TouchableOpacity>
          <View className={`self-start px-3 py-1 rounded-full mb-3 ${categoryStyle}`}>
            <Text className={`text-xs font-semibold capitalize`}>{exercise.category}</Text>
          </View>
          <Text className="text-2xl font-bold text-dark">{exercise.name}</Text>
          <View className="flex-row gap-4 mt-3">
            <View className="items-center">
              <Text className="text-lg font-bold text-green-dark">{exercise.sets_default}</Text>
              <Text className="text-xs text-muted">sets</Text>
            </View>
            <View className="w-px bg-green-dark opacity-20" />
            <View className="items-center">
              <Text className="text-lg font-bold text-green-dark">{exercise.reps_default}</Text>
              <Text className="text-xs text-muted">reps</Text>
            </View>
            {exercise.rest_seconds > 0 && (
              <>
                <View className="w-px bg-green-dark opacity-20" />
                <View className="items-center">
                  <Text className="text-lg font-bold text-green-dark">{exercise.rest_seconds}s</Text>
                  <Text className="text-xs text-muted">rest</Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* Why this exercise */}
          <View className="bg-green-light rounded-2xl p-4">
            <Text className="text-sm font-semibold text-green-dark mb-2">Why this exercise</Text>
            <Text className="text-base text-body leading-relaxed">{exercise.why_it_helps}</Text>
          </View>

          {/* Coaching cue */}
          <View>
            <Text className="text-base font-semibold text-dark mb-2">Key coaching cue</Text>
            <View className="bg-surface border border-border rounded-2xl p-4">
              <Text className="text-base text-body leading-relaxed">💡 {exercise.coaching_cue}</Text>
            </View>
          </View>

          {/* Muscle groups */}
          {exercise.muscle_groups.length > 0 && (
            <View>
              <Text className="text-base font-semibold text-dark mb-3">Muscles worked</Text>
              <View className="flex-row flex-wrap gap-2">
                {exercise.muscle_groups.map((m) => (
                  <View key={m} className="bg-surface border border-border rounded-full px-3 py-1">
                    <Text className="text-sm text-body capitalize">{m}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Equipment */}
          <View>
            <Text className="text-base font-semibold text-dark mb-3">Equipment needed</Text>
            <View className="flex-row flex-wrap gap-2">
              {exercise.equipment.map((e) => (
                <View key={e} className="bg-surface border border-border rounded-full px-3 py-1">
                  <Text className="text-sm text-body capitalize">{e === 'none' ? 'No equipment' : e}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Difficulty */}
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-muted">Difficulty:</Text>
            <Text className="text-sm font-semibold text-dark capitalize">{exercise.difficulty}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
