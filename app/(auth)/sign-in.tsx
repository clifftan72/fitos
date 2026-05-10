import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/constants/theme';

export default function SignInScreen() {
  const { signIn, signInWithGoogle, signInWithApple, profile } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = email.includes('@') && password.length >= 8;

  async function handleSignIn() {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      // Auth state change in useAuth will update the store;
      // root layout handles redirect based on onboarding_complete.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed.');
    }
  }

  async function handleApple() {
    setError(null);
    try {
      await signInWithApple();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Apple sign-in failed.');
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-dark mb-2">Welcome back</Text>
        <Text className="text-base text-muted mb-8">
          Sign in to continue your journey.
        </Text>

        <View className="gap-4 mb-6">
          <View>
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

          <View>
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-sm text-body">Password</Text>
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text className="text-sm text-green">Forgot password?</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <TextInput
              className="border border-border rounded-xl px-4 py-3.5 text-base text-dark bg-surface"
              placeholder="Your password"
              placeholderTextColor={colors.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
            />
          </View>
        </View>

        {error && (
          <Text className="text-sm text-attention mb-4">{error}</Text>
        )}

        <TouchableOpacity
          className={`rounded-xl py-4 items-center mb-4 ${isValid ? 'bg-green' : 'bg-green-light'}`}
          onPress={handleSignIn}
          disabled={!isValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className={`text-base font-semibold ${isValid ? 'text-white' : 'text-green-dark'}`}>
              Sign in
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-sm text-muted mx-3">or</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        <TouchableOpacity
          className="border border-border rounded-xl py-4 items-center mb-3"
          onPress={handleGoogle}
          activeOpacity={0.8}
        >
          <Text className="text-base font-medium text-dark">Continue with Google</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            className="bg-dark rounded-xl py-4 items-center mb-3"
            onPress={handleApple}
            activeOpacity={0.8}
          >
            <Text className="text-base font-medium text-white">Continue with Apple</Text>
          </TouchableOpacity>
        )}

        <View className="flex-row justify-center mt-6">
          <Text className="text-sm text-muted">Don&apos;t have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-green">Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
