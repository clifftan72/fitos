import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { generateDemoFindings } from '@/lib/posture-analysis';
import { generateProgram } from '@/lib/program-generator';
import { useAppStore } from '@/stores/useAppStore';
import { colors } from '@/constants/theme';

const MESSAGES = [
  'Checking shoulder alignment...',
  'Measuring neck position...',
  'Evaluating spine curvature...',
  'Assessing hip balance...',
  'Building your personalised plan...',
];

export default function ProcessingScreen() {
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  const { user, profile } = useAppStore();
  const [msgIndex, setMsgIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2800);

    const timer = setTimeout(() => runAnalysis(), 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(timer);
    };
  }, []);

  async function saveProgram(findings: ReturnType<typeof generateDemoFindings>['findings'], resolvedScanId: string) {
    if (!user) return;
    try {
      const programData = generateProgram(findings, profile, resolvedScanId, user.id);
      await supabase.from('programs').insert(programData);
    } catch {
      // non-fatal — scan report still navigates correctly
    }
  }

  async function runAnalysis() {
    if (!scanId || scanId === 'demo') {
      const { findings, score } = generateDemoFindings();
      try {
        const { data } = await supabase
          .from('scans')
          .insert({ status: 'complete', findings, overall_score: score })
          .select()
          .single();
        if (data) {
          await saveProgram(findings, data.id);
          router.replace(`/scan/report/${data.id}`);
        } else {
          router.replace('/scan/report/demo');
        }
      } catch {
        router.replace('/scan/report/demo');
      }
      return;
    }

    try {
      const { findings, score } = generateDemoFindings();

      await supabase
        .from('scans')
        .update({ findings, overall_score: score, status: 'complete' })
        .eq('id', scanId);

      await saveProgram(findings, scanId);
      router.replace(`/scan/report/${scanId}`);
    } catch {
      router.replace(`/scan/report/${scanId}`);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-32 h-32 rounded-full bg-green-light items-center justify-center mb-10">
          <Text style={{ fontSize: 64 }}>🧍</Text>
        </View>

        <Text className="text-2xl font-bold text-white text-center mb-3">
          Analysing your posture
        </Text>

        <Text className="text-base text-muted text-center mb-10">
          {MESSAGES[msgIndex]}
        </Text>

        <ActivityIndicator size="large" color={colors.green} />
      </View>
    </SafeAreaView>
  );
}
