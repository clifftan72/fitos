import { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/useAppStore';
import { Program, ProgramDay, ProgramExercise, ExerciseLog } from '@/types';
import { EXERCISES } from '@/constants/exercises';
import { colors } from '@/constants/theme';

function ExerciseRow({
  pe, done, onToggle,
}: {
  pe: ProgramExercise;
  done: boolean;
  onToggle: () => void;
}) {
  const ex = EXERCISES.find((e) => e.slug === pe.exercise_slug);
  const name = ex?.name ?? pe.exercise_slug;

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      className={`rounded-2xl p-4 mb-3 border flex-row items-center gap-4 ${
        done ? 'bg-green-light border-green' : 'bg-white border-border'
      }`}
    >
      {/* Check circle */}
      <View
        className={`w-8 h-8 rounded-full items-center justify-center border-2 ${
          done ? 'bg-green border-green' : 'border-border bg-surface'
        }`}
      >
        {done && <Text className="text-white text-xs font-bold">✓</Text>}
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className={`text-base font-semibold mb-0.5 ${done ? 'text-green-dark' : 'text-dark'}`}>
          {name}
        </Text>
        <Text className="text-xs text-muted">
          {pe.sets} sets · {pe.reps} reps · {pe.rest_seconds}s rest
        </Text>
        {ex?.coaching_cue && !done && (
          <Text className="text-xs text-body mt-1 leading-relaxed" numberOfLines={2}>
            {ex.coaching_cue}
          </Text>
        )}
      </View>

      {/* Detail link */}
      <TouchableOpacity
        onPress={() => router.push(`/workout/exercise/${pe.exercise_slug}`)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text className="text-green text-lg">›</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function SessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { week: weekParam, day: dayParam } = useLocalSearchParams<{ week: string; day: string }>();
  const { user } = useAppStore();

  const [program, setProgram] = useState<Program | null>(null);
  const [day, setDay] = useState<ProgramDay | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const startedAt = useRef(Date.now());

  const weekNumber = parseInt(weekParam ?? '1', 10);
  const dayNumber = parseInt(dayParam ?? '1', 10);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('programs')
          .select('*')
          .eq('id', sessionId)
          .single();
        if (data) {
          const prog = data as Program;
          setProgram(prog);
          const weekData = prog.weeks_data.find((w) => w.week_number === weekNumber);
          const dayData = weekData?.days.find((d) => d.day_number === dayNumber) ?? null;
          setDay(dayData);
        }
      } catch {
        // fallback: no program found
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId, weekNumber, dayNumber]);

  function toggleExercise(slug: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }

  async function completeSession() {
    if (!user || !program || !day || saving) return;
    setSaving(true);

    const exercisesCompleted: ExerciseLog[] = day.exercises.map((pe: ProgramExercise) => ({
      exercise_id: pe.exercise_slug,
      sets_done: done.has(pe.exercise_slug) ? pe.sets : 0,
      reps_done: pe.reps,
    }));

    const durationMinutes = Math.round((Date.now() - startedAt.current) / 60000);

    try {
      await supabase.from('workout_logs').insert({
        user_id: user.id,
        program_id: program.id,
        week_number: weekNumber,
        day_number: dayNumber,
        exercises_completed: exercisesCompleted,
        duration_minutes: durationMinutes || day.duration_minutes,
        notes: null,
      });
    } catch {
      // non-fatal
    } finally {
      setSaving(false);
      router.back();
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color={colors.green} />
      </SafeAreaView>
    );
  }

  if (!day) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-8">
        <Text className="text-lg font-semibold text-dark text-center mb-4">Session not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-green font-semibold">← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const doneCount = done.size;
  const totalCount = day.exercises.length;
  const allDone = doneCount === totalCount && totalCount > 0;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-6 pb-4">
          <TouchableOpacity onPress={() => router.back()} className="pt-4 mb-2">
            <Text className="text-sm text-muted">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xs font-semibold text-muted tracking-widest uppercase mb-1">
            Week {weekNumber} · Day {dayNumber}
          </Text>
          <Text className="text-2xl font-bold text-dark">{day.title}</Text>
          <Text className="text-sm text-muted mt-1">{day.duration_minutes} min · {totalCount} exercises</Text>
        </View>

        {/* Progress */}
        <View className="mx-6 mt-4 mb-2">
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs text-muted">{doneCount} of {totalCount} completed</Text>
            {allDone && <Text className="text-xs text-green font-semibold">All done!</Text>}
          </View>
          <View className="h-1.5 bg-border rounded-full overflow-hidden">
            <View
              className="h-1.5 bg-green rounded-full"
              style={{ width: totalCount > 0 ? `${(doneCount / totalCount) * 100}%` : '0%' }}
            />
          </View>
        </View>

        {/* Exercises */}
        <View className="px-6 pt-3 pb-4">
          {day.exercises.map((pe: ProgramExercise) => (
            <ExerciseRow
              key={pe.exercise_slug}
              pe={pe}
              done={done.has(pe.exercise_slug)}
              onToggle={() => toggleExercise(pe.exercise_slug)}
            />
          ))}
        </View>

        {/* Finish CTA */}
        <View className="px-6 pb-10">
          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${allDone ? 'bg-green' : 'bg-dark'}`}
            onPress={completeSession}
            activeOpacity={0.8}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {allDone ? 'Complete session ✓' : 'Finish early'}
              </Text>
            )}
          </TouchableOpacity>
          <Text className="text-xs text-muted text-center mt-3">
            Your progress is saved when you complete the session.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
