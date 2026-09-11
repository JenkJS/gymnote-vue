import type { SystemExercise } from './types'

export const systemExercises = [
  {
    id: 'system:bench-press',
    source: 'system',
    nameKey: 'exercise.catalog.benchPress',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:squat',
    source: 'system',
    nameKey: 'exercise.catalog.squat',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:deadlift',
    source: 'system',
    nameKey: 'exercise.catalog.deadlift',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:overhead-press',
    source: 'system',
    nameKey: 'exercise.catalog.overheadPress',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:barbell-row',
    source: 'system',
    nameKey: 'exercise.catalog.barbellRow',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:pull-up',
    source: 'system',
    nameKey: 'exercise.catalog.pullUp',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:dumbbell-bench-press',
    source: 'system',
    nameKey: 'exercise.catalog.dumbbellBenchPress',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:seated-cable-row',
    source: 'system',
    nameKey: 'exercise.catalog.seatedCableRow',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:seated-dumbbell-press',
    source: 'system',
    nameKey: 'exercise.catalog.seatedDumbbellPress',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:lat-pulldown',
    source: 'system',
    nameKey: 'exercise.catalog.latPulldown',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:romanian-deadlift',
    source: 'system',
    nameKey: 'exercise.catalog.romanianDeadlift',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:lunge',
    source: 'system',
    nameKey: 'exercise.catalog.lunge',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:plank',
    source: 'system',
    nameKey: 'exercise.catalog.plank',
    measurement: 'duration',
  },
  {
    id: 'system:one-arm-dumbbell-row',
    source: 'system',
    nameKey: 'exercise.catalog.oneArmDumbbellRow',
    measurement: 'weight_repetitions',
  },
  {
    id: 'system:incline-dumbbell-reverse-fly',
    source: 'system',
    nameKey: 'exercise.catalog.inclineDumbbellReverseFly',
    measurement: 'weight_repetitions',
  },
] satisfies readonly SystemExercise[]
