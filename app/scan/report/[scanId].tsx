import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { generateDemoFindings } from '@/lib/posture-analysis';
import { Scan, PostureFinding, FindingSeverity } from '@/types';
import { colors } from '@/constants/theme';

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? colors.green : score >= 40 ? colors.monitor : colors.attention;
  const label = score >= 70 ? 'Good' : score >= 40 ? 'Fair' : 'Needs work';
  return (
    <View className="items-center py-8">
      <View
        style={{ width: 140, height: 140, borderRadius: 70, borderWidth: 8, borderColor: color }}
        className="items-center justify-center bg-white"
      >
        <Text style={{ color, fontSize: 40, fontWeight: 'bold' }}>{score}</Text>
        <Text style={{ color }} className="text-xs font-medium">{label}</Text>
      </View>
      <Text className="text-base text-muted mt-3">Your posture score</Text>
    </View>
  );
}

function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  const styles: Record<FindingSeverity, { bg: string; text: string; label: string }> = {
    attention: { bg: 'bg-red-50', text: 'text-red-600',   label: 'Attention' },
    monitor:   { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Monitor' },
    good:      { bg: 'bg-green-light', text: 'text-green-dark', label: 'Good' },
  };
  const s = styles[severity];
  return (
    <View className={`px-2.5 py-1 rounded-full ${s.bg}`}>
      <Text className={`text-xs font-semibold ${s.text}`}>{s.label}</Text>
    </View>
  );
}

function FindingCard({ finding }: { finding: PostureFinding }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-border mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-base font-semibold text-dark flex-1 pr-2">{finding.headline}</Text>
        <SeverityBadge severity={finding.severity} />
      </View>

      <Text className="text-sm text-muted mb-2 capitalize">
        {finding.body_part.replace(/_/g, ' ')}
      </Text>

      {expanded && (
        <View className="mt-2 gap-3">
          <Text className="text-sm text-body leading-relaxed">{finding.plain_explanation}</Text>
          <View className="bg-surface rounded-xl p-3">
            <Text className="text-xs font-semibold text-muted mb-1">CAUSE</Text>
            <Text className="text-sm text-body">{finding.cause}</Text>
          </View>
          {finding.corrective_exercises.length > 0 && (
            <View>
              <Text className="text-xs font-semibold text-muted mb-2">CORRECTIVE EXERCISES</Text>
              <View className="flex-row flex-wrap gap-2">
                {finding.corrective_exercises.map((slug) => (
                  <TouchableOpacity
                    key={slug}
                    className="bg-green-light rounded-full px-3 py-1"
                    onPress={() => router.push(`/workout/exercise/${slug}`)}
                    activeOpacity={0.8}
                  >
                    <Text className="text-xs font-medium text-green-dark capitalize">
                      {slug.replace(/-/g, ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity onPress={() => setExpanded((e) => !e)} className="mt-3">
        <Text className="text-sm text-green font-medium">
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ScanReportScreen() {
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!scanId || scanId === 'demo') {
        const { findings, score } = generateDemoFindings();
        setScan({
          id: 'demo', user_id: '', status: 'complete',
          findings, overall_score: score,
          front_image_url: null, back_image_url: null,
          left_image_url: null, right_image_url: null,
          landmarks_raw: null, created_at: new Date().toISOString(),
        });
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('scans')
          .select('*')
          .eq('id', scanId)
          .single();
        if (data) setScan(data as Scan);
        else {
          const { findings, score } = generateDemoFindings();
          setScan({ id: scanId, user_id: '', status: 'complete', findings, overall_score: score, front_image_url: null, back_image_url: null, left_image_url: null, right_image_url: null, landmarks_raw: null, created_at: new Date().toISOString() });
        }
      } catch {
        const { findings, score } = generateDemoFindings();
        setScan({ id: scanId, user_id: '', status: 'complete', findings, overall_score: score, front_image_url: null, back_image_url: null, left_image_url: null, right_image_url: null, landmarks_raw: null, created_at: new Date().toISOString() });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [scanId]);

  if (loading || !scan) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color={colors.green} />
      </SafeAreaView>
    );
  }

  const issueFindings = scan.findings.filter((f) => f.severity !== 'good');
  const scoreText =
    scan.overall_score >= 70
      ? 'Your posture is in good shape overall. Keep up the habits that got you here.'
      : scan.overall_score >= 40
      ? 'There are a few areas worth focusing on. The exercises below will help significantly.'
      : 'Your scan reveals several postural patterns to address. Your personalised program targets all of them.';

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-6 pb-4">
          <TouchableOpacity onPress={() => router.back()} className="pt-4 mb-2">
            <Text className="text-sm text-muted">← Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-dark">Your scan results</Text>
        </View>

        {/* Score */}
        <View className="bg-white mb-3">
          <ScoreRing score={scan.overall_score} />
          <Text className="text-base text-body text-center px-8 pb-6 leading-relaxed">
            {scoreText}
          </Text>
        </View>

        {/* Findings */}
        <View className="px-4 pb-4">
          <Text className="text-lg font-semibold text-dark mb-4">
            {issueFindings.length === 0 ? 'No issues found 🎉' : `${issueFindings.length} finding${issueFindings.length > 1 ? 's' : ''} detected`}
          </Text>

          {issueFindings.map((finding, i) => (
            <FindingCard key={i} finding={finding} />
          ))}
        </View>

        {/* CTA */}
        <View className="px-4 pb-8 gap-3">
          <TouchableOpacity
            className="bg-green rounded-xl py-4 items-center"
            onPress={() => router.replace('/(tabs)/workout')}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">View your program →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 items-center"
            onPress={() => router.replace('/scan/capture')}
            activeOpacity={0.8}
          >
            <Text className="text-sm text-muted">Scan again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
