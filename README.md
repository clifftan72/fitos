# FitOS

A free consumer fitness app for iOS and Android that delivers AI-powered posture scanning, personalised workout programs, and an AI coaching chat.

## Features

- **Body Scan** — Capture 4 photos (front, back, left, right) and get an instant posture score with detailed findings
- **Corrective Program** — Auto-generated 4-week workout program based on your scan results
- **Exercise Library** — 25 corrective exercises with coaching cues, muscle groups, and progression tracking
- **AI Coach** — Conversational coaching powered by Claude (Phase F)
- **Workout Logging** — Track session completion and progress over time

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54 / React Native |
| Routing | Expo Router v6 (file-based) |
| Styling | NativeWind v4 + Tailwind CSS v3 |
| Backend | Supabase (Postgres, Auth, Storage) |
| State | Zustand |
| AI | Anthropic Claude API |
| Analytics | PostHog |

## Project Structure

```
app/
├── (auth)/          # Sign in, sign up, forgot password
├── (tabs)/          # Bottom tab navigation
│   ├── index.tsx    # Home dashboard
│   ├── scan.tsx     # Body scan entry
│   ├── workout.tsx  # Program overview
│   ├── coach.tsx    # AI coach chat
│   └── trainers.tsx # Trainers (Phase 2)
├── onboarding/      # 3-step onboarding flow
├── scan/            # Capture → Processing → Report
└── workout/         # Session view, exercise detail
lib/
├── supabase.ts          # Supabase client
├── posture-analysis.ts  # MediaPipe landmark checks
└── program-generator.ts # Scan → 4-week program logic
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/clifftan72/fitos.git
cd fitos
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env.local` file in the root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-key
EXPO_PUBLIC_POSTHOG_KEY=your-posthog-key
```

### Database Setup

Run the migrations in your Supabase SQL editor in order:

```
supabase/migrations/001_core.sql       # Core schema + RLS policies
supabase/migrations/002_trainers.sql   # Trainers waitlist
supabase/migrations/003_seed_exercises.sql  # 25 exercises
```

### Run

```bash
# iOS simulator
npx expo start --ios

# Android emulator
npx expo start --android

# Web (demo mode — camera falls back to demo findings)
npx expo start --web
```

## Build Phases

| Phase | Description | Status |
|---|---|---|
| A | Infrastructure, auth, navigation | ✅ Complete |
| B | Onboarding flow | ✅ Complete |
| C | Exercise library | ✅ Complete |
| D | Body scan + posture analysis | ✅ Complete |
| E | Workout program generation | ✅ Complete |
| F | AI coach (Claude streaming) | 🔜 Next |
| G | Home dashboard | 🔜 Planned |
| H | Push notifications, analytics, EAS Build | 🔜 Planned |

## Database Schema

- `profiles` — user profile and onboarding data
- `scans` — posture scan results and findings
- `exercises` — exercise library (seeded)
- `programs` — generated 4-week corrective programs
- `workout_logs` — session completion records
- `conversations` — AI coach chat history
- `waitlist` — trainers waitlist (Phase 2)

## Posture Analysis

The body scan analyses 4 landmark checks using MediaPipe Pose (33 landmarks):

- **Forward head posture** — ear vs shoulder offset on frontal view
- **Rounded shoulders** — elbow z-depth relative to shoulder
- **Shoulder height asymmetry** — left vs right shoulder y-position
- **Anterior pelvic tilt** — hip vs knee x-position on side view

On web, demo findings are used as a fallback since MediaPipe is not available in the React Native Web environment.

## License

Private — all rights reserved.
