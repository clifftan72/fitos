import { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/useAppStore';
import { Sex, Equipment } from '@/types';
import { colors } from '@/constants/theme';

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const EQUIPMENT_OPTIONS: { value: Equipment; label: string; sub: string }[] = [
  { value: 'none', label: 'No equipment', sub: 'Bodyweight only' },
  { value: 'home', label: 'Home equipment', sub: 'Bands, dumbbells, mat' },
  { value: 'gym', label: 'Full gym', sub: 'Access to a gym' },
];

export default function StepBodyScreen() {
  const { user } = useAppStore();

  const [sex, setSex] = useState<Sex | null>(null);
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleEquipment(val: Equipment) {
    setEquipment((prev) =>
      prev.includes(val) ? prev.filter((e) => e !== val) : [...prev, val]
    );
  }

  const isValid = sex !== null && age.length > 0 && equipment.length > 0;

  async function handleContinue() {
    if (!isValid || !user) return;
    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({
          sex,
          age: parseInt(age, 10),
          height_cm: heightCm ? parseFloat(heightCm) : null,
          weight_kg: weightKg ? parseFloat(weightKg) : null,
          equipment: equipment.length > 0 ? equipment : ['none'],
        })
        .eq('id', user.id);
      router.push('/onboarding/step-3-scan-prompt');
    } catch {
      router.push('/onboarding/step-3-scan-prompt');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-10 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View className="flex-row gap-1.5 mb-8">
          <View className="flex-1 h-1 rounded-full bg-green" />
          <View className="flex-1 h-1 rounded-full bg-green" />
          <View className="flex-1 h-1 rounded-full bg-border" />
        </View>

        <TouchableOpacity onPress={() => router.back()} className="mb-6">
          <Text className="text-sm text-muted">← Back</Text>
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-dark mb-2">
          A bit about your body
        </Text>
        <Text className="text-base text-muted mb-8">
          Used to personalise your program. Never shared.
        </Text>

        {/* Sex */}
        <Text className="text-sm font-semibold text-body mb-3">Sex</Text>
        <View className="flex-row gap-2 mb-6">
          {SEX_OPTIONS.map((opt) => {
            const active = sex === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                className={`flex-1 py-3 rounded-xl border-2 items-center ${
                  active ? 'border-green bg-green-light' : 'border-border bg-white'
                }`}
                onPress={() => setSex(opt.value)}
                activeOpacity={0.8}
              >
                <Text className={`text-xs font-medium ${active ? 'text-green-dark' : 'text-body'}`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Age / Height / Weight */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-body mb-2">Age</Text>
            <TextInput
              className="border border-border rounded-xl px-3 py-3 text-base text-dark bg-surface"
              placeholder="30"
              placeholderTextColor={colors.muted}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-body mb-2">Height (cm)</Text>
            <TextInput
              className="border border-border rounded-xl px-3 py-3 text-base text-dark bg-surface"
              placeholder="175"
              placeholderTextColor={colors.muted}
              value={heightCm}
              onChangeText={setHeightCm}
              keyboardType="decimal-pad"
              maxLength={5}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-body mb-2">Weight (kg)</Text>
            <TextInput
              className="border border-border rounded-xl px-3 py-3 text-base text-dark bg-surface"
              placeholder="75"
              placeholderTextColor={colors.muted}
              value={weightKg}
              onChangeText={setWeightKg}
              keyboardType="decimal-pad"
              maxLength={5}
            />
          </View>
        </View>

        {/* Equipment */}
        <Text className="text-sm font-semibold text-body mb-3">Equipment access</Text>
        <View className="gap-2 mb-8">
          {EQUIPMENT_OPTIONS.map((opt) => {
            const active = equipment.includes(opt.value);
            return (
              <TouchableOpacity
                key={opt.value}
                className={`flex-row items-center p-4 rounded-2xl border-2 ${
                  active ? 'border-green bg-green-light' : 'border-border bg-white'
                }`}
                onPress={() => toggleEquipment(opt.value)}
                activeOpacity={0.8}
              >
                <View className="flex-1">
                  <Text className={`text-base font-semibold ${active ? 'text-green-dark' : 'text-dark'}`}>
                    {opt.label}
                  </Text>
                  <Text className="text-sm text-muted">{opt.sub}</Text>
                </View>
                <View className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  active ? 'bg-green border-green' : 'border-border'
                }`}>
                  {active && <Text className="text-white text-xs">✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${isValid ? 'bg-green' : 'bg-green-light'}`}
          onPress={handleContinue}
          disabled={!isValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className={`text-base font-semibold ${isValid ? 'text-white' : 'text-green-dark'}`}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
