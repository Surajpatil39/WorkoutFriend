export const WORKOUT_PLANS = [
  {
    id: 'beginner',
    name: 'Fresher / Beginner',
    description: 'Build basic strength and learn form.',
    days: {
      'Monday': { name: 'Full Body A', exercises: ['Bodyweight Squats', 'Push-ups', 'Lat Pulldown', 'Dumbbell Shoulder Press', 'Plank'] },
      'Wednesday': { name: 'Full Body B', exercises: ['Leg Press', 'Chest Press', 'Seated Row', 'Dumbbell Lunges', 'Leg Raises'] },
      'Friday': { name: 'Full Body A', exercises: ['Bodyweight Squats', 'Push-ups', 'Lat Pulldown', 'Dumbbell Shoulder Press', 'Plank'] },
    }
  },
  {
    id: 'fullbody-abs',
    name: 'Full Body + Abs',
    description: 'Entire body training with core focus.',
    days: {
      'Monday': { name: 'Full Body A + Abs', exercises: ['Squats', 'Bench Press', 'Lat Pulldown', 'Shoulder Press', 'Bicep Curls', 'Plank', 'Crunches'] },
      'Wednesday': { name: 'Full Body B + Abs', exercises: ['Romanian Deadlift', 'Incline Dumbbell Press', 'Seated Row', 'Lunges', 'Tricep Pushdown', 'Leg Raises'] },
      'Friday': { name: 'Full Body C + Abs', exercises: ['Leg Press', 'Chest Press', 'Cable Row', 'Lateral Raises', 'Hammer Curls', 'Cable Crunches'] },
    }
  },
  {
    id: 'upper-lower',
    name: 'Upper + Lower + Abs',
    description: 'Higher volume and muscle focus.',
    days: {
      'Monday': { name: 'Upper Body', exercises: ['Bench Press', 'Lat Pulldown', 'Shoulder Press', 'Seated Row', 'Bicep Curls', 'Tricep Pushdown'] },
      'Tuesday': { name: 'Lower Body', exercises: ['Squats', 'Romanian Deadlift', 'Leg Press', 'Leg Curl', 'Calf Raises'] },
      'Wednesday': { name: 'Abs + Cardio', exercises: ['Cable Crunches', 'Leg Raises', 'Plank'] },
      'Thursday': { name: 'Upper Body', exercises: ['Incline Dumbbell Press', 'Cable Row', 'Lateral Raises', 'Face Pulls', 'Hammer Curls', 'Overhead Tricep Extension'] },
      'Friday': { name: 'Lower Body', exercises: ['Deadlift', 'Lunges', 'Leg Extension', 'Leg Curl', 'Calf Raises'] },
      'Saturday': { name: 'Abs + Cardio', exercises: ['Bicycle Crunches', 'Hanging Leg Raises', 'Side Plank'] },
    }
  },
  {
    id: 'ppl-abs',
    name: 'Push + Pull + Legs + Abs',
    description: 'Intermediate/Advanced muscle group training.',
    days: {
      'Monday': { name: 'Push', exercises: ['Bench Press', 'Incline Dumbbell Press', 'Shoulder Press', 'Lateral Raises', 'Tricep Pushdown'] },
      'Tuesday': { name: 'Pull', exercises: ['Lat Pulldown', 'Barbell Row', 'Seated Cable Row', 'Face Pulls', 'Bicep Curls'] },
      'Wednesday': { name: 'Legs', exercises: ['Squats', 'Romanian Deadlift', 'Leg Press', 'Leg Curl', 'Leg Extension', 'Calf Raises'] },
      'Thursday': { name: 'Abs + Cardio', exercises: ['Cable Crunches', 'Hanging Leg Raises', 'Plank', 'Russian Twists'] },
      'Friday': { name: 'Push', exercises: ['Incline Bench Press', 'Chest Fly', 'Arnold Press', 'Lateral Raises', 'Overhead Tricep Extension'] },
      'Saturday': { name: 'Pull', exercises: ['Pull-ups', 'Dumbbell Row', 'Cable Row', 'Rear Delt Fly', 'Hammer Curls'] },
      'Sunday': { name: 'Legs + Abs', exercises: ['Lunges', 'Leg Press', 'Leg Curl', 'Leg Extension', 'Calf Raises', 'Plank', 'Leg Raises'] },
    }
  }
];
