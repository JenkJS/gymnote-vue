export type LocaleMessages = {
  common: {
    loading: string
    saving: string
    retry: string
  }
  header: {
    subtitle: string
    language: string
  }
  exercise: {
    catalog: {
      benchPress: string
      squat: string
      deadlift: string
      overheadPress: string
      barbellRow: string
      pullUp: string
      dumbbellBenchPress: string
      seatedCableRow: string
      seatedDumbbellPress: string
      latPulldown: string
      romanianDeadlift: string
      lunge: string
      plank: string
      oneArmDumbbellRow: string
      inclineDumbbellReverseFly: string
    }
    selector: {
      label: string
      placeholder: string
      selected: string
      add: string
    }
    workoutListTitle: string
  }
  workoutSet: {
    title: string
    empty: string
    weightLabel: string
    repetitionsLabel: string
    durationLabel: string
    add: string
    edit: string
    editAriaLabel: string
    save: string
    cancel: string
    remove: string
    removeAriaLabel: string
    weightUnit: string
    repetitionsUnit: string
    durationUnit: string
  }
  workout: {
    title: string
    noActive: string
    activeTitle: string
    activeDescription: string
    statusActive: string
    elapsedTime: string
    programDay: string
    previousResult: string
    prescription: {
      repetitions: string
      repetitionsRange: string
      duration: string
    }
    errors: {
      load: string
      save: string
    }
    actions: {
      start: string
      finish: string
    }
  }
  trainingProgram: {
    title: string
    description: string
    empty: string
    dayCount: string
    chooseDay: string
    startDay: string
    activeWorkoutWarning: string
    import: {
      label: string
      hint: string
      action: string
      importing: string
      success: string
    }
    errors: {
      load: string
      fileReadFailed: string
      invalidJson: string
      invalidStructure: string
      unknownExercise: string
      saveFailed: string
    }
  }
  history: {
    title: string
    date: string
    duration: string
    exercises: string
    sets: string
    volume: string
    minuteUnit: string
    volumeUnit: string
    freeWorkout: string
    exerciseResults: string
    noSets: string
  }
}
