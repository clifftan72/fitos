import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types';

interface AppState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  session: null,
  user: null,
  profile: null,
  setSession: (session) =>
    set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
}));
