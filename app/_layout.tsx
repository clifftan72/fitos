import '../global.css';

import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/constants/theme';

function AuthGuard() {
  const { session, profile, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!session) {
      if (!inAuthGroup) router.replace('/(auth)/sign-in');
    } else if (!profile?.onboarding_complete) {
      if (!inOnboarding) router.replace('/onboarding/step-1-goals');
    } else {
      if (inAuthGroup || inOnboarding) router.replace('/(tabs)');
    }
  }, [session, profile, loading, segments]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { loading: authLoading } = useAuth();

  if (!fontsLoaded || authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="workout" />
      </Stack>
    </>
  );
}
