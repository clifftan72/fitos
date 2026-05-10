import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = email.includes('@');

  async function handleReset() {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 px-6 pt-16 pb-10">
        <Text className="text-3xl font-bold text-dark mb-2">Reset password</Text>
        <Text className="text-base text-muted mb-8">
          Enter your email and we&apos;ll send you a link to reset your password.
        </Text>

        {sent ? (
          <View className="bg-green-light rounded-2xl p-5">
            <Text className="text-base font-semibold text-green-dark mb-1">
              Check your inbox
            </Text>
            <Text className="text-sm text-body">
              We sent a password reset link to {email}. It may take a minute to arrive.
            </Text>
          </View>
        ) : (
          <>
            <View className="mb-6">
              <Text className="text-sm text-body mb-1.5">Email</Text>
              <TextInput
                className="border border-border rounded-xl px-4 py-3.5 text-base text-dark bg-surface"
                placeholder="jane@example.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            {error && (
              <Text className="text-sm text-attention mb-4">{error}</Text>
            )}

            <TouchableOpacity
              className={`rounded-xl py-4 items-center mb-4 ${isValid ? 'bg-green' : 'bg-green-light'}`}
              onPress={handleReset}
              disabled={!isValid || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text className={`text-base font-semibold ${isValid ? 'text-white' : 'text-green-dark'}`}>
                  Send reset link
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <View className="flex-row justify-center mt-6">
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text className="text-sm text-green font-semibold">Back to sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
