import { useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator, Platform, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/useAppStore';
import { colors } from '@/constants/theme';

type ViewAngle = 'front' | 'back' | 'left' | 'right';

const VIEWS: { angle: ViewAngle; label: string; instruction: string; silhouette: string }[] = [
  { angle: 'front', label: 'FRONT VIEW',  instruction: 'Stand facing the camera, arms slightly away from your sides', silhouette: '🧍' },
  { angle: 'back',  label: 'BACK VIEW',   instruction: 'Turn around so your back faces the camera', silhouette: '🧍' },
  { angle: 'left',  label: 'LEFT SIDE',   instruction: 'Turn so your left side faces the camera', silhouette: '🧍' },
  { angle: 'right', label: 'RIGHT SIDE',  instruction: 'Turn so your right side faces the camera', silhouette: '🧍' },
];

type CapturedPhotos = Partial<Record<ViewAngle, string>>;

export default function CaptureScreen() {
  const { user } = useAppStore();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [viewIndex, setViewIndex] = useState(0);
  const [captured, setCaptured] = useState<CapturedPhotos>({});
  const [flash, setFlash] = useState(false);
  const [uploading, setUploading] = useState(false);

  const currentView = VIEWS[viewIndex];

  const handleCapture = useCallback(async () => {
    if (uploading) return;

    // Try to take a real photo; fall back to null on web or if camera isn't ready
    let uri: string | null = null;
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: false });
        uri = photo?.uri ?? null;
      } catch {
        uri = null;
      }
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    const next = { ...captured, [currentView.angle]: uri ?? '' };
    setCaptured(next);

    if (viewIndex < VIEWS.length - 1) {
      setViewIndex((i) => i + 1);
    } else {
      await submitScan(next);
    }
  }, [viewIndex, captured, uploading, currentView]);

  async function submitScan(photos: CapturedPhotos) {
    if (!user) return;
    setUploading(true);
    try {
      const scanId = crypto.randomUUID();
      const uploaded: Partial<Record<string, string>> = {};

      for (const [angle, uri] of Object.entries(photos)) {
        if (!uri) continue;
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const path = `scans/${user.id}/${scanId}/${angle}.jpg`;
          const { error } = await supabase.storage
            .from('scan-images')
            .upload(path, blob, { contentType: 'image/jpeg', upsert: true });
          if (!error) {
            const { data } = supabase.storage.from('scan-images').getPublicUrl(path);
            uploaded[`${angle}_image_url`] = data.publicUrl;
          }
        } catch {
          // skip individual upload failure
        }
      }

      const { data: scan } = await supabase
        .from('scans')
        .insert({
          id: scanId,
          user_id: user.id,
          status: 'processing',
          ...uploaded,
        })
        .select()
        .single();

      if (scan) {
        router.replace(`/scan/processing?scanId=${scan.id}`);
      }
    } catch {
      router.replace('/scan/processing?scanId=demo');
    } finally {
      setUploading(false);
    }
  }

  // Loading: permissions not resolved yet
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-dark items-center justify-center">
        <ActivityIndicator color={colors.green} />
      </SafeAreaView>
    );
  }

  // Native permission denied
  if (!permission.granted && Platform.OS !== 'web') {
    return (
      <SafeAreaView className="flex-1 bg-dark items-center justify-center px-8">
        <Text className="text-white text-xl font-bold text-center mb-4">Camera access needed</Text>
        <Text className="text-muted text-base text-center mb-8">
          FitOS needs your camera to capture your posture for analysis.
        </Text>
        <TouchableOpacity
          className="bg-green rounded-xl py-4 px-8 w-full items-center"
          onPress={requestPermission}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">Allow camera</Text>
        </TouchableOpacity>
        {!permission.canAskAgain && (
          <Text className="text-muted text-xs text-center mt-3">
            Camera access was denied. Enable it in your device Settings.
          </Text>
        )}
        <TouchableOpacity
          className="mt-4 py-3 w-full items-center"
          onPress={() => router.replace('/scan/processing?scanId=demo')}
          activeOpacity={0.8}
        >
          <Text className="text-muted text-sm">Skip — use demo mode</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-2" onPress={() => router.back()}>
          <Text className="text-muted text-sm">Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      {/* Camera layer — no children to avoid web inconsistency */}
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={'front' as CameraType} />

      {/* Flash overlay */}
      {flash && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'white', opacity: 0.8, zIndex: 10 }]} />
      )}

      {/* UI overlay — absolutely positioned on top of camera */}
      <View style={StyleSheet.absoluteFill} className="flex-1">
        {/* Top bar */}
        <SafeAreaView>
          <View className="flex-row items-center justify-between px-6 pt-2">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-white text-base">✕</Text>
            </TouchableOpacity>
            <Text className="text-white font-semibold text-sm tracking-widest">
              {currentView.label}
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>

        {/* Silhouette guide */}
        <View className="flex-1 items-center justify-center">
          <View
            className="border-2 border-white opacity-60 rounded-3xl items-center justify-center"
            style={{ width: 200, height: 380 }}
          >
            <Text style={{ fontSize: 120 }}>{currentView.silhouette}</Text>
          </View>
          <Text className="text-white text-sm text-center mt-4 px-8 opacity-80">
            {currentView.instruction}
          </Text>
        </View>

        {/* Bottom controls */}
        <View className="pb-12 px-6 items-center">
          {/* Progress dots */}
          <View className="flex-row gap-2 mb-8">
            {VIEWS.map((_, i) => (
              <View
                key={i}
                className={`h-2 rounded-full ${i < viewIndex ? 'bg-green w-4' : i === viewIndex ? 'bg-white w-4' : 'bg-white opacity-30 w-2'}`}
              />
            ))}
          </View>

          {uploading ? (
            <View className="items-center gap-3">
              <ActivityIndicator size="large" color={colors.green} />
              <Text className="text-white text-sm">Uploading photos...</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleCapture}
              activeOpacity={0.8}
              style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: colors.white,
                borderWidth: 4, borderColor: colors.green,
                alignItems: 'center', justifyContent: 'center',
              }}
            />
          )}

          {Object.keys(captured).length > 0 && (
            <Text className="text-white text-xs opacity-60 mt-4">
              {Object.keys(captured).length} / 4 captured
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
