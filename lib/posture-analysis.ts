import { PostureFinding, FindingSeverity } from '@/types';

// Landmark indices for MediaPipe Pose (33 landmarks)
const LM = {
  NOSE: 0, LEFT_EAR: 7, RIGHT_EAR: 8,
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13, RIGHT_ELBOW: 14,
  LEFT_HIP: 23, RIGHT_HIP: 24,
  LEFT_KNEE: 25, RIGHT_KNEE: 26,
  LEFT_ANKLE: 27, RIGHT_ANKLE: 28,
};

export interface Landmark { x: number; y: number; z: number; visibility: number }
type LM_Array = Landmark[];

function mid(a: Landmark, b: Landmark): Landmark {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2, visibility: Math.min(a.visibility, b.visibility) };
}

function checkForwardHead(front: LM_Array): PostureFinding | null {
  const ear = mid(front[LM.LEFT_EAR], front[LM.RIGHT_EAR]);
  const shoulder = mid(front[LM.LEFT_SHOULDER], front[LM.RIGHT_SHOULDER]);
  const offset = Math.abs(ear.x - shoulder.x);
  if (offset < 0.03) return null;
  const severity: FindingSeverity = offset > 0.07 ? 'attention' : 'monitor';
  return {
    body_part: 'neck', severity, tag: 'forward_head',
    headline: 'Forward head posture detected',
    plain_explanation: 'Your head sits noticeably in front of your shoulders. For every 2.5cm forward, your neck bears the equivalent of an extra 4–5kg of load.',
    cause: 'Usually caused by prolonged screen time, looking down at a phone, or extended desk work without proper ergonomics.',
    corrective_exercises: ['chin-tuck', 'deep-neck-flexor-activation', 'thoracic-extension', 'doorway-chest-stretch'],
  };
}

function checkRoundedShoulders(front: LM_Array): PostureFinding | null {
  const ls = front[LM.LEFT_SHOULDER];
  const rs = front[LM.RIGHT_SHOULDER];
  const le = front[LM.LEFT_ELBOW];
  const re = front[LM.RIGHT_ELBOW];
  const leftForward = le.z < ls.z - 0.05;
  const rightForward = re.z < rs.z - 0.05;
  if (!leftForward && !rightForward) return null;
  return {
    body_part: 'left_shoulder', severity: 'monitor', tag: 'rounded_shoulders',
    headline: 'Rounded shoulders detected',
    plain_explanation: 'Your shoulders are rolling forward. This shortens the chest muscles and lengthens the upper back muscles over time, leading to tension and reduced shoulder mobility.',
    cause: 'Prolonged sitting, desk work, or repetitive pushing movements without balancing pulling exercises.',
    corrective_exercises: ['face-pull', 'wall-angel', 'doorway-chest-stretch', 'band-pull-apart'],
  };
}

function checkShoulderAsymmetry(front: LM_Array): PostureFinding | null {
  const diff = Math.abs(front[LM.LEFT_SHOULDER].y - front[LM.RIGHT_SHOULDER].y);
  if (diff < 0.025) return null;
  const higher = front[LM.LEFT_SHOULDER].y < front[LM.RIGHT_SHOULDER].y ? 'left' : 'right';
  const severity: FindingSeverity = diff > 0.05 ? 'attention' : 'monitor';
  return {
    body_part: 'left_shoulder', severity, tag: 'shoulder_asymmetry',
    headline: `Shoulder height imbalance — ${higher} side higher`,
    plain_explanation: `Your ${higher} shoulder sits noticeably higher than the other. This can cause neck tension on the elevated side and affect how loads are distributed through your spine.`,
    cause: 'Often from carrying a bag on one shoulder, dominant hand habits, or compensating for tightness on one side.',
    corrective_exercises: ['upper-trap-stretch', 'single-arm-carry', 'side-lying-external-rotation'],
  };
}

function checkAnteriorPelvicTilt(side: LM_Array): PostureFinding | null {
  const hip = side[LM.LEFT_HIP];
  const knee = side[LM.LEFT_KNEE];
  if (!hip || !knee) return null;
  const hipForwardOfKnee = hip.x - knee.x;
  if (hipForwardOfKnee < 0.04) return null;
  return {
    body_part: 'left_hip', severity: 'monitor', tag: 'anterior_pelvic_tilt',
    headline: 'Anterior pelvic tilt detected',
    plain_explanation: 'Your pelvis is tilting forward, which increases the arch in your lower back and can cause chronic lower back discomfort and tight hip flexors.',
    cause: 'Common in people who sit for long periods. The hip flexors shorten and pull the front of the pelvis down.',
    corrective_exercises: ['hip-flexor-stretch', 'glute-bridge', 'dead-bug', 'posterior-pelvic-tilt'],
  };
}

export function analysePosture(
  frontLandmarks: LM_Array,
  _backLandmarks: LM_Array,
  leftLandmarks: LM_Array,
  _rightLandmarks: LM_Array,
): { findings: PostureFinding[]; score: number } {
  const findings: PostureFinding[] = [];

  const checks = [
    checkForwardHead(frontLandmarks),
    checkRoundedShoulders(frontLandmarks),
    checkShoulderAsymmetry(frontLandmarks),
    checkAnteriorPelvicTilt(leftLandmarks),
  ];
  for (const f of checks) if (f) findings.push(f);

  const deductions: Record<string, number> = { attention: 20, monitor: 10, good: 0 };
  const score = Math.max(0, 100 - findings.reduce((acc, f) => acc + deductions[f.severity], 0));
  return { findings, score };
}

// Generate demo findings when no real landmark data is available
export function generateDemoFindings(): { findings: PostureFinding[]; score: number } {
  const findings: PostureFinding[] = [
    {
      body_part: 'neck', severity: 'monitor', tag: 'forward_head',
      headline: 'Forward head posture detected',
      plain_explanation: 'Your head sits noticeably in front of your shoulders. For every 2.5cm forward, your neck bears the equivalent of an extra 4–5kg of load.',
      cause: 'Usually caused by prolonged screen time, looking down at a phone, or extended desk work without proper ergonomics.',
      corrective_exercises: ['chin-tuck', 'deep-neck-flexor-activation', 'thoracic-extension'],
    },
    {
      body_part: 'left_shoulder', severity: 'monitor', tag: 'rounded_shoulders',
      headline: 'Rounded shoulders detected',
      plain_explanation: 'Your shoulders are rolling forward. This shortens the chest muscles and lengthens the upper back muscles over time.',
      cause: 'Prolonged sitting, desk work, or repetitive pushing movements without balancing pulling exercises.',
      corrective_exercises: ['face-pull', 'wall-angel', 'band-pull-apart'],
    },
  ];
  return { findings, score: 72 };
}
