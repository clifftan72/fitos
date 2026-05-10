import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step-1-goals" />
      <Stack.Screen name="step-2-body" />
      <Stack.Screen name="step-3-scan-prompt" />
    </Stack>
  );
}
