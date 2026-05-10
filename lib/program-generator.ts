import { PostureFinding, Profile, Program, ProgramDay, ProgramExercise, ProgramWeek } from '@/types';
import { EXERCISES } from '@/constants/exercises';

const FOUNDATION_SLUGS = ['diaphragmatic-breathing', 'walking'];

const WEEK_THEMES = [
  'Foundation & Awareness',
  'Building Habits',
  'Progressive Loading',
  'Consolidation',
];

function slugsForFindings(findings: PostureFinding[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const f of findings) {
    for (const s of f.corrective_exercises) {
      if (!seen.has(s)) { seen.add(s); result.push(s); }
    }
  }
  return result;
}

function buildProgramExercises(slugs: string[], week: number): ProgramExercise[] {
  return slugs.map((slug) => {
    const ex = EXERCISES.find((e) => e.slug === slug);
    const progressMultiplier = 1 + (week - 1) * 0.1;
    return {
      exercise_id: slug,
      exercise_slug: slug,
      sets: ex ? Math.min(ex.sets_default + Math.floor((week - 1) / 2), ex.sets_default + 2) : 3,
      reps: ex?.reps_default ?? '12',
      rest_seconds: ex ? Math.max(ex.rest_seconds - (week - 1) * 5, 20) : 45,
      notes: week >= 3 ? 'Focus on mind-muscle connection' : undefined,
    };
  });
}

function buildDay(
  dayNumber: number,
  title: string,
  slugs: string[],
  week: number,
  isRest = false,
): ProgramDay {
  const exercises = isRest ? [] : buildProgramExercises(slugs, week);
  const durationMinutes = isRest ? 0 : Math.max(15, exercises.length * 5);
  return { day_number: dayNumber, title, exercises, duration_minutes: durationMinutes, is_rest_day: isRest };
}

export function generateProgram(
  findings: PostureFinding[],
  profile: Partial<Profile> | null,
  scanId: string | null,
  userId: string,
): Omit<Program, 'id' | 'created_at'> {
  const correctiveSlugs = slugsForFindings(findings.filter((f) => f.severity !== 'good'));
  const allSlugs = [...new Set([...FOUNDATION_SLUGS, ...correctiveSlugs])];

  // Split into two sessions: upper-focus and lower-focus based on body_part
  const upperTags = new Set(['neck', 'left_shoulder', 'right_shoulder', 'thoracic_spine']);
  const upperSlugs = allSlugs.filter((slug) => {
    const ex = EXERCISES.find((e) => e.slug === slug);
    if (!ex) return false;
    return ex.posture_tags.some((t) => {
      const finding = findings.find((f) => f.tag === t);
      return finding && upperTags.has(finding.body_part);
    }) || ex.muscle_groups.some((mg) =>
      ['neck', 'upper trapezius', 'rear deltoids', 'rhomboids', 'thoracic spine', 'deep cervical flexors',
       'pectoralis major', 'pectoralis minor', 'lower trapezius', 'serratus anterior', 'rotator cuff', 'erector spinae'].includes(mg),
    );
  });
  const lowerSlugs = allSlugs.filter((slug) => !upperSlugs.includes(slug) || FOUNDATION_SLUGS.includes(slug));

  const sessionA = upperSlugs.length > 0 ? upperSlugs : allSlugs.slice(0, Math.ceil(allSlugs.length / 2));
  const sessionB = lowerSlugs.length > 0 ? lowerSlugs : allSlugs.slice(Math.ceil(allSlugs.length / 2));

  const weeks: ProgramWeek[] = WEEK_THEMES.map((theme, wi) => {
    const week = wi + 1;
    const days: ProgramDay[] = [
      buildDay(1, 'Session A — Upper', sessionA, week),
      buildDay(2, 'Rest & Walk', ['walking'], week, false),
      buildDay(3, 'Session B — Lower & Core', sessionB, week),
      buildDay(4, 'Rest', [], week, true),
      buildDay(5, 'Full Body', allSlugs, week),
      buildDay(6, 'Active Recovery', ['diaphragmatic-breathing', 'walking'], week),
      buildDay(7, 'Rest', [], week, true),
    ];
    return { week_number: week, theme, days };
  });

  const issueCount = findings.filter((f) => f.severity !== 'good').length;
  const description = issueCount === 0
    ? 'A maintenance program to keep your posture in great shape.'
    : `A 4-week corrective program addressing ${issueCount} postural finding${issueCount > 1 ? 's' : ''} identified in your scan.`;

  return {
    user_id: userId,
    scan_id: scanId,
    title: '4-Week Corrective Program',
    description,
    weeks_total: 4,
    weeks_data: weeks,
    is_active: true,
    started_at: new Date().toISOString(),
  };
}
