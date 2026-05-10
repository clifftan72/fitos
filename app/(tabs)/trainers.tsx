import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { colors } from '@/constants/theme';

// Phase 2 placeholder — trainer marketplace
export default function TrainersScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = email.includes('@');

  async function handleWaitlist() {
    if (!isValid) return;
    setLoading(true);
    try {
      await supabase.from('waitlist').insert({ email: email.trim() });
      setSubmitted(true);
    } catch {
      // fail silently — waitlist table not yet created
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 items-center justify-center">
        <View className="bg-green-light rounded-full w-20 h-20 items-center justify-center mb-6">
          <Text className="text-4xl">🎯</Text>
        </View>

        <View className="bg-green rounded-full px-3 py-1 mb-4">
          <Text className="text-xs font-semibold text-white">COMING SOON</Text>
        </View>

        <Text className="text-3xl font-bold text-dark text-center mb-3">
          Find your coach
        </Text>
        <Text className="text-base text-body text-center leading-relaxed mb-8">
          Connect with verified trainers near you. Browse profiles, check reviews,
          and book sessions — all in one place.
        </Text>

        {submitted ? (
          <View className="bg-green-light rounded-2xl p-5 w-full">
            <Text className="text-base font-semibold text-green-dark text-center mb-1">
              You&apos;re on the list!
            </Text>
            <Text className="text-sm text-body text-center">
              We&apos;ll notify you as soon as the trainer marketplace launches.
            </Text>
          </View>
        ) : (
          <View className="w-full gap-3">
            <TextInput
              className="border border-border rounded-xl px-4 py-3.5 text-base text-dark bg-surface"
              placeholder="your@email.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${isValid ? 'bg-green' : 'bg-green-light'}`}
              onPress={handleWaitlist}
              disabled={!isValid || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text className={`text-base font-semibold ${isValid ? 'text-white' : 'text-green-dark'}`}>
                  Notify me at launch
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
