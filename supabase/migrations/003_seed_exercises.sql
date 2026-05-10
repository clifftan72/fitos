-- Exercise Library Seed Data
-- Run this in the Supabase SQL editor after 001_core.sql

insert into public.exercises (name, slug, category, muscle_groups, equipment, difficulty, posture_tags, sets_default, reps_default, rest_seconds, coaching_cue, why_it_helps) values

('Chin Tuck', 'chin-tuck', 'corrective',
  array['deep cervical flexors','neck'], array['none'], 'beginner', array['forward_head'],
  3, '10', 30,
  'Glide your chin straight back — like you''re making a double chin — without tilting your head.',
  'Reactivates the deep neck flexors that switch off when your head drifts forward, pulling your head back over your shoulders.'),

('Deep Neck Flexor Activation', 'deep-neck-flexor-activation', 'corrective',
  array['deep cervical flexors'], array['none'], 'beginner', array['forward_head'],
  3, '10', 30,
  'Lie on your back, nod your chin gently toward your chest — only 5–10°. Hold 5 seconds.',
  'Directly strengthens the small muscles at the front of your neck that control head position. Essential for correcting forward head posture.'),

('Thoracic Extension Over Foam Roller', 'thoracic-extension', 'mobility',
  array['thoracic spine','erector spinae'], array['home'], 'beginner', array['forward_head','kyphosis','rounded_shoulders'],
  2, '8', 45,
  'Place the roller across your mid-back. Support your head, extend back over the roller slowly. Move it up or down your spine.',
  'Opens the thoracic spine which is often stiff from sitting. Restoring extension here naturally pulls your shoulders back and head upright.'),

('Face Pull', 'face-pull', 'corrective',
  array['rear deltoids','rotator cuff','rhomboids'], array['home','gym'], 'beginner', array['rounded_shoulders'],
  3, '15', 45,
  'Pull the band to your face, elbows flaring out and back. Squeeze your shoulder blades together at the end of each rep.',
  'Strengthens the rear deltoids and external rotators that are chronically weak in people with rounded shoulders, pulling them back into alignment.'),

('Wall Angel', 'wall-angel', 'corrective',
  array['lower trapezius','serratus anterior','thoracic spine'], array['none'], 'beginner', array['rounded_shoulders','kyphosis'],
  3, '10', 45,
  'Stand with your back, head, and arms flat against a wall. Slide arms overhead while keeping everything in contact with the wall.',
  'Trains your scapulae to move correctly while opening your chest and strengthening the postural muscles of your upper back.'),

('Band Pull-Apart', 'band-pull-apart', 'corrective',
  array['rear deltoids','rhomboids','middle trapezius'], array['home'], 'beginner', array['rounded_shoulders'],
  3, '15', 30,
  'Hold a band in front at chest height, arms straight. Pull it apart until fully stretched, squeezing shoulder blades together.',
  'Targets the horizontal pulling muscles that balance out the chest — the most overlooked muscle group in people who sit at desks.'),

('Doorway Chest Stretch', 'doorway-chest-stretch', 'mobility',
  array['pectoralis major','pectoralis minor','anterior deltoid'], array['none'], 'beginner', array['rounded_shoulders','forward_head'],
  2, '30 sec', 30,
  'Stand in a doorway, forearms on the frame. Step forward until you feel a stretch across your chest. Don''t arch your lower back.',
  'Stretches the tight chest muscles that pull your shoulders forward. Short pecs are one of the main causes of rounded shoulders.'),

('Seated Cable Row', 'seated-row', 'strength',
  array['rhomboids','middle trapezius','biceps','lats'], array['gym'], 'beginner', array['rounded_shoulders'],
  3, '12', 60,
  'Pull to your lower chest, elbows close to your sides. Hold 1 second at the top. Control the weight back — don''t let it yank you forward.',
  'One of the most effective exercises for building the mid-back strength that holds your shoulders in proper alignment throughout the day.'),

('Upper Trapezius Stretch', 'upper-trap-stretch', 'mobility',
  array['upper trapezius','levator scapulae'], array['none'], 'beginner', array['shoulder_asymmetry'],
  2, '30 sec each side', 30,
  'Sit tall. Tilt your ear to your shoulder while gently pulling your head with the opposite hand. Keep the other shoulder down.',
  'Releases the chronically tight upper trap that elevates one shoulder higher than the other, causing neck tension and asymmetrical posture.'),

('Single Arm Farmer''s Carry', 'single-arm-carry', 'strength',
  array['core','obliques','trapezius','grip'], array['home','gym'], 'intermediate', array['shoulder_asymmetry'],
  3, '30 sec each side', 60,
  'Hold a weight in one hand, stand tall, and walk. Resist the urge to lean — your core should work to keep you upright.',
  'Forces your core to stabilise against lateral load, correcting muscle imbalances that cause one shoulder to sit higher than the other.'),

('Side-Lying External Rotation', 'side-lying-external-rotation', 'corrective',
  array['infraspinatus','teres minor','rotator cuff'], array['none','home'], 'beginner', array['shoulder_asymmetry'],
  3, '12 each side', 45,
  'Lie on your side, elbow bent at 90°. Rotate your forearm up toward the ceiling slowly. Don''t let your elbow move from your side.',
  'Directly targets the small rotator cuff muscles that control shoulder positioning — often weak on one side, creating visible asymmetry.'),

('Kneeling Hip Flexor Stretch', 'hip-flexor-stretch', 'mobility',
  array['iliopsoas','rectus femoris','hip flexors'], array['none'], 'beginner', array['anterior_pelvic_tilt'],
  2, '45 sec each side', 30,
  'Kneel on one knee. Squeeze your back glute, tuck your pelvis under, then shift forward until you feel a stretch in your front hip.',
  'Lengthens shortened hip flexors that pull the front of your pelvis down into an anterior tilt, causing lower back discomfort and a protruding belly.'),

('Glute Bridge', 'glute-bridge', 'corrective',
  array['gluteus maximus','hamstrings','core'], array['none'], 'beginner', array['anterior_pelvic_tilt','knee_valgus'],
  3, '15', 45,
  'Lie on your back, feet flat. Drive through your heels and squeeze your glutes hard at the top. Hold 2 seconds. Don''t let your lower back arch.',
  'Activates weak glutes that fail to control your pelvis. Strong glutes are the primary antagonist to tight hip flexors — the main driver of pelvic tilt.'),

('Dead Bug', 'dead-bug', 'corrective',
  array['deep core','transverse abdominis','multifidus'], array['none'], 'beginner', array['anterior_pelvic_tilt'],
  3, '8 each side', 45,
  'Lie on your back, arms up, knees at 90°. Lower opposite arm and leg while pressing your lower back into the floor. Switch sides.',
  'Trains deep core stability without loading your spine — essential for correcting anterior pelvic tilt and protecting your lower back.'),

('Posterior Pelvic Tilt (Lying)', 'posterior-pelvic-tilt', 'corrective',
  array['core','glutes','hip flexors'], array['none'], 'beginner', array['anterior_pelvic_tilt'],
  3, '15', 30,
  'Lie on your back, knees bent. Flatten your lower back into the floor by contracting your abs and glutes. Hold 5 seconds.',
  'Retrains your pelvis to find neutral position by strengthening the muscles that oppose the anterior tilt pattern.'),

('Prone Cobra', 'prone-cobra', 'corrective',
  array['lower trapezius','rhomboids','erector spinae'], array['none'], 'beginner', array['kyphosis'],
  3, '12', 45,
  'Lie face down. Lift your chest and rotate your thumbs toward the ceiling, squeezing your shoulder blades together. Look at the floor.',
  'Directly strengthens the lower trapezius and thoracic extensors that are lengthened and weak in people with a rounded upper back (kyphosis).'),

('Clamshell', 'clamshell', 'corrective',
  array['gluteus medius','hip external rotators'], array['none','home'], 'beginner', array['knee_valgus'],
  3, '15 each side', 30,
  'Lie on your side, hips stacked, knees bent at 45°. Open your top knee like a clamshell while keeping your feet together. Don''t rock your pelvis.',
  'Isolates the gluteus medius — the hip muscle that prevents knees from caving inward when you walk, run, or squat.'),

('Side-Lying Hip Abduction', 'side-lying-abduction', 'corrective',
  array['gluteus medius','TFL'], array['none'], 'beginner', array['knee_valgus'],
  3, '15 each side', 30,
  'Lie on your side, bottom knee bent for stability. Lift your straight top leg to about 45°. Control it back down slowly.',
  'Builds hip abductor strength to keep your knee aligned over your foot — directly correcting knee valgus (knees caving inward).'),

('Goblet Squat', 'goblet-squat', 'strength',
  array['quadriceps','glutes','core','upper back'], array['home','gym'], 'beginner', array['knee_valgus'],
  3, '12', 60,
  'Hold a weight at your chest, squat deep. Drive your knees out over your pinky toes. Chest up throughout.',
  'The goblet position keeps your torso upright, teaching correct squat mechanics while the movement pattern trains knees to track properly.'),

('Plank', 'plank', 'strength',
  array['core','transverse abdominis','shoulders'], array['none'], 'beginner', array['anterior_pelvic_tilt'],
  3, '30 sec', 45,
  'Forearms down, body in a straight line from head to heel. Squeeze your glutes. Don''t let your hips sag or pike up.',
  'Builds the anterior core strength needed to hold your pelvis in neutral — reducing the excessive arch that comes with anterior pelvic tilt.'),

('Reverse Lunge', 'reverse-lunge', 'strength',
  array['quadriceps','glutes','hamstrings','core'], array['none'], 'beginner', array['anterior_pelvic_tilt'],
  3, '10 each leg', 60,
  'Step back, lower your back knee toward the floor. Keep your front shin vertical and your torso upright. Drive through your front heel to stand.',
  'Strengthens the glutes and quads while stretching the hip flexors of the back leg in every rep — targeting two causes of anterior pelvic tilt simultaneously.'),

('Bodyweight Squat', 'bodyweight-squat', 'strength',
  array['quadriceps','glutes','hamstrings'], array['none'], 'beginner', array[]::text[],
  3, '15', 45,
  'Feet shoulder-width apart, toes slightly out. Sit back and down, keeping your chest up and knees tracking over your toes.',
  'The fundamental lower body movement pattern. Builds leg strength and reinforces proper knee and hip mechanics used in everyday life.'),

('Push-Up', 'push-up', 'strength',
  array['pectoralis major','triceps','anterior deltoid','core'], array['none'], 'beginner', array[]::text[],
  3, '10', 60,
  'Hands slightly wider than shoulders. Lower until your chest nearly touches the floor. Keep your body in a rigid plank throughout.',
  'Builds pushing strength and core stability. When paired with pulling exercises, maintains the muscle balance that keeps your shoulders healthy.'),

('Diaphragmatic Breathing', 'diaphragmatic-breathing', 'recovery',
  array['diaphragm','deep core'], array['none'], 'beginner', array[]::text[],
  1, '10 slow breaths', 0,
  'Lie down, one hand on chest, one on belly. Breathe in through your nose — only the belly hand should rise. Exhale fully through your mouth.',
  'Resets your nervous system, reduces cortisol, and reactivates the diaphragm — the foundation of core stability and proper breathing mechanics.'),

('Walking (30 min)', 'walking', 'cardio',
  array['full body'], array['none'], 'beginner', array[]::text[],
  1, '30 min', 0,
  'Walk tall — chin back, shoulders relaxed, arms swinging naturally. Aim for a brisk pace where you can hold a conversation but feel warm.',
  'The most underrated form of exercise. Improves cardiovascular health, accelerates recovery, and reinforces proper gait patterns.')

on conflict (slug) do nothing;
