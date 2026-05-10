import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ScanScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="px-6 pt-6 pb-10">
        <Text className="text-3xl font-bold text-dark mb-1">Body Scan</Text>
        <Text className="text-base text-muted mb-8">
          Analyse your posture and get a personalised corrective program.
        </Text>

        {/* Main CTA */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-border mb-6 items-center">
          <View className="bg-green-light rounded-full w-24 h-24 items-center justify-center mb-4">
            <Text style={{ fontSize: 52 }}>🧍</Text>
          </View>
          <Text className="text-lg font-bold text-dark text-center mb-2">
            Ready to scan?
          </Text>
          <Text className="text-sm text-body text-center mb-6 leading-relaxed">
            Stand 2–3 metres from your camera. You&apos;ll capture 4 views: front, back, left side, and right side.
          </Text>
          <TouchableOpacity
            className="bg-green rounded-xl py-4 px-8 w-full items-center"
            onPress={() => router.push('/scan/capture')}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">Start scan</Text>
          </TouchableOpacity>
        </View>

        {/* What to expect */}
        <Text className="text-base font-semibold text-dark mb-4">What to expect</Text>
        {[
          { icon: '📸', title: '4 photos', desc: 'Front, back, left and right views' },
          { icon: '⏱️', title: '2 minutes', desc: 'Quick and straightforward process' },
          { icon: '📊', title: 'Instant results', desc: 'Posture score and personalised findings' },
          { icon: '🏋️', title: 'Custom program', desc: 'Corrective exercises built for your body' },
        ].map((item) => (
          <View key={item.title} className="flex-row items-center gap-4 bg-white rounded-2xl p-4 mb-3 border border-border">
            <Text style={{ fontSize: 28 }}>{item.icon}</Text>
            <View>
              <Text className="text-base font-semibold text-dark">{item.title}</Text>
              <Text className="text-sm text-muted">{item.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
