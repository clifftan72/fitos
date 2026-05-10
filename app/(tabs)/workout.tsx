import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/useAppStore';
import { Program, ProgramDay, WorkoutLog } from '@/types';
import { colors } from '@/constants/theme';
import { EXERCISES } from '@/constants/exercises';

function dayDuration(day: ProgramDay): string {
  return day.is_rest_day ? 'Rest' : `${day.duration_minutes} min`;
}

function isToday(log: WorkoutLog, weekNum: number, dayNum: number): boolean {
  return log.week_number === weekNum && log.day_number === dayNum;
}

function DayCard({
  day, weekNum, completed, onPress,
}: {
  day: ProgramDay;
  weekNum: number;
  completed: boolean;
  onPress: () => void;
}) {
  const exerciseNames = day.exercises
    .slice(0, 3)
    .map((pe) => {
      const ex = EXERCISES.find((e) => e.slug === pe.exercise_slug);
      return ex?.name ?? pe.exercise_slug;
    })
    .join(' · ');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={day.is_rest_day ? 1 : 0.8}
      disabled={day.is_rest_day}
      className={`rounded-2xl p-4 mb-3 border ${
        completed
          ? 'bg-green-light border-green'
          : day.is_rest_day
          ? 'bg-surface border-border opacity-60'
          : 'bg-white border-border'
      }`}
    >
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-xs font-semibold text-muted tracking-widest uppercase">
          Day {day.day_number}
        </Text>
        <View className="flex-row items-center gap-1">
          {completed && <Text className="text-xs text-green font-semibold">✓ Done</Text>}
          <Text className="text-xs text-muted">{dayDuration(day)}</Text>
        </View>
      </View>
      <Text className={`text-base font-semibold mb-1 ${completed ? 'text-green-dark' : 'text-dark'}`}>
        {day.title}
      </Text>
      {!day.is_rest_day && day.exercises.length > 0 && (
        <Text className="text-xs text-muted" numberOfLines={1}>
          {exerciseNames}{day.exercises.length > 3 ? ` +${day.exercises.length - 3} more` : ''}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function WorkoutScreen() {
  const { user } = useAppStore();
  const [program, setProgram] = useState<Program | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadProgram();
    }, [user]),
  );

  async function loadProgram() {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const [{ data: prog }, { data: logData }] = await Promise.all([
        supabase
          .from('programs')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('workout_logs')
          .select('*')
          .eq('user_id', user.id),
      ]);
      if (prog) setProgram(prog as Program);
      if (logData) setLogs(logData as WorkoutLog[]);
    } catch {
      // no program yet
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color={colors.green} />
      </SafeAreaView>
    );
  }

  if (!program) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView contentContainerClassName="px-6 pt-6 pb-10">
          <Text className="text-3xl font-bold text-dark mb-1">Your Program</Text>
          <Text className="text-base text-muted mb-8">
            Complete a body scan to get your personalised program.
          </Text>
          <View className="bg-white rounded-3xl p-6 border border-border items-center">
            <Text style={{ fontSize: 52 }} className="mb-4">📋</Text>
            <Text className="text-lg font-bold text-dark text-center mb-2">No program yet</Text>
            <Text className="text-sm text-body text-center mb-6 leading-relaxed">
              Your corrective program is generated automatically after your body scan.
            </Text>
            <TouchableOpacity
              className="bg-green rounded-xl py-4 px-8 w-full items-center"
              onPress={() => router.push('/scan/capture')}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-base">Start body scan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentWeekData = program.weeks_data[activeWeek];
  const completedKeys = new Set(logs.map((l) => `${l.week_number}-${l.day_number}`));
  const totalSessions = program.weeks_data.flatMap((w) => w.days.filter((d) => !d.is_rest_day)).length;
  const completedSessions = logs.length;
  const progressPct = Math.min(Math.round((completedSessions / totalSessions) * 100), 100);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-dark mb-1">{program.title}</Text>
          <Text className="text-base text-muted">{program.description}</Text>
        </View>

        {/* Progress bar */}
        <View className="mx-6 mb-4 bg-white rounded-2xl p-4 border border-border">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm font-semibold text-dark">Overall progress</Text>
            <Text className="text-sm text-green font-semibold">{progressPct}%</Text>
          </View>
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View className="h-2 bg-green rounded-full" style={{ width: `${progressPct}%` }} />
          </View>
          <Text className="text-xs text-muted mt-2">{completedSessions} of {totalSessions} sessions completed</Text>
        </View>

        {/* Week tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerClassName="px-6 gap-2">
          {program.weeks_data.map((w, i) => (
            <TouchableOpacity
              key={w.week_number}
              onPress={() => setActiveWeek(i)}
              className={`px-4 py-2 rounded-full border ${
                activeWeek === i ? 'bg-green border-green' : 'bg-white border-border'
              }`}
              activeOpacity={0.8}
            >
              <Text className={`text-sm font-semibold ${activeWeek === i ? 'text-white' : 'text-dark'}`}>
                Week {w.week_number}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Week theme */}
        <View className="mx-6 mb-3">
          <Text className="text-xs font-semibold text-muted tracking-widest uppercase mb-1">
            Week {currentWeekData.week_number} theme
          </Text>
          <Text className="text-base font-semibold text-dark">{currentWeekData.theme}</Text>
        </View>

        {/* Days */}
        <View className="px-6 pb-10">
          {currentWeekData.days.map((day) => {
            const completed = completedKeys.has(`${currentWeekData.week_number}-${day.day_number}`);
            return (
              <DayCard
                key={day.day_number}
                day={day}
                weekNum={currentWeekData.week_number}
                completed={completed}
                onPress={() => {
                  if (!day.is_rest_day) {
                    router.push(
                      `/workout/session/${program.id}?week=${currentWeekData.week_number}&day=${day.day_number}`,
                    );
                  }
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
