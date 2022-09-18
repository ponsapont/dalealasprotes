type Routine  = {
    _id: string,
    name: string,
    exerciseDefs: Array<ExerciseDef>,
};

type ExerciseDef = {
    _id: string,
    name: string,
    muscleGroups: Array<MuscleGroup>,
};

type MuscleGroup = {
    _id: string,
    id: number,
    name: string,
};

type Workout = {
    _id: string,
    date: Date,
    exercises: Array<Exercise>,
}

type Exercise = {
    _id: string,
    exerciseDefRef: string,
    sets: Array<ExerciseSet>,
}

type ExerciseSet = {
    _id: string,
    repetitions: number,
    weight: number,
}


export type { Routine, ExerciseDef, MuscleGroup, Workout, Exercise, ExerciseSet };