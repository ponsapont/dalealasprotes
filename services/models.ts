type Routine  = {
    name: string,
    exerciseDefs: Array<ExerciseDef>,
};

type ExerciseDef = {
    name: string,
    muscleGroups: Array<MuscleGroup>,
};

type MuscleGroup = {
    [key: number]: string
};

type Workout = {
    date: Date,
    exercises: Array<Exercise>,
}

type Exercise = {
    exerciseDefRef: string,
    sets: Array<ExerciseSet>,
}

type ExerciseSet = {
    repetitions: number,
    weight: number,
}


export type { Routine, ExerciseDef, MuscleGroup, Workout, Exercise, ExerciseSet };