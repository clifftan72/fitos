// ── Auth & Profile ────────────────────────────────────────────────────────────

export type Goal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'posture'
  | 'general_health'
  | 'injury_recovery';

export type Sex = 'male' | 'female' | 'prefer_not_to_say';
export type Equipment = 'none' | 'home' | 'gym';
export type SubscriptionTier = 'free' | 'premium';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  age: number | null;
  sex: Sex | null;
  height_cm: number | null;
  weight_kg: number | null;
  primary_goal: Goal | null;
  equipment: Equipment[];
  subscription_tier: SubscriptionTier;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

// ── Body Scan ─────────────────────────────────────────────────────────────────

export type BodyPart =
  | 'neck'
  | 'left_shoulder'
  | 'right_shoulder'
  | 'thoracic_spine'
  | 'lumbar_spine'
  | 'left_hip'
  | 'right_hip'
  | 'left_knee'
  | 'right_knee'
  | 'left_ankle'
  | 'right_ankle';

export type FindingSeverity = 'good' | 'monitor' | 'attention';

export type PostureTag =
  | 'forward_head'
  | 'rounded_shoulders'
  | 'kyphosis'
  | 'lordosis'
  | 'anterior_pelvic_tilt'
  | 'posterior_pelvic_tilt'
  | 'hip_hike'
  | 'knee_valgus'
  | 'knee_varus'
  | 'overpronation'
  | 'supination'
  | 'scoliosis_indicator'
  | 'shoulder_asymmetry'
  | 'elbow_flare';

export interface PostureFinding {
  body_part: BodyPart;
  severity: FindingSeverity;
  tag: PostureTag;
  headline: string;
  plain_explanation: string;
  cause: string;
  corrective_exercises: string[];
}

export interface Scan {
  id: string;
  user_id: string;
  front_image_url: string | null;
  back_image_url: string | null;
  left_image_url: string | null;
  right_image_url: string | null;
  landmarks_raw: Record<string, unknown> | null;
  findings: PostureFinding[];
  overall_score: number;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  created_at: string;
}

// ── Exercises ─────────────────────────────────────────────────────────────────

export type ExerciseCategory =
  | 'strength'
  | 'mobility'
  | 'corrective'
  | 'cardio'
  | 'recovery';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  category: ExerciseCategory;
  muscle_groups: string[];
  equipment: Equipment[];
  difficulty: Difficulty;
  posture_tags: PostureTag[];
  sets_default: number;
  reps_default: string;
  rest_seconds: number;
  video_url: string | null;
  thumbnail_url: string | null;
  coaching_cue: string;
  why_it_helps: string;
}

// ── Workout Programs ──────────────────────────────────────────────────────────

export interface ProgramExercise {
  exercise_id: string;
  exercise_slug: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

export interface ProgramDay {
  day_number: number;
  title: string;
  duration_minutes: number;
  exercises: ProgramExercise[];
  is_rest_day: boolean;
}

export interface ProgramWeek {
  week_number: number;
  theme: string;
  days: ProgramDay[];
}

export interface Program {
  id: string;
  user_id: string;
  scan_id: string | null;
  title: string;
  description: string;
  weeks_total: number;
  weeks_data: ProgramWeek[];
  is_active: boolean;
  started_at: string;
  created_at: string;
}

// ── Workout Logs ──────────────────────────────────────────────────────────────

export interface ExerciseLog {
  exercise_id: string;
  sets_done: number;
  reps_done: string;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  program_id: string;
  week_number: number;
  day_number: number;
  completed_at: string;
  exercises_completed: ExerciseLog[];
  duration_minutes: number | null;
  notes: string | null;
}

// ── AI Coach ──────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}
