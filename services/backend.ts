import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ExerciseDef, Routine, Workout } from "./models";

export const getMuscleGroups = async () => {
    return (await getDocs(collection(db, 'muscle-groups'))).docs.map(doc => doc.data())
}

export const getExerciseDefs = async (): Promise<Array<ExerciseDef>> =>  {
    return (await getDocs(collection(db, 'exercises'))).docs.map(doc => doc.data()) as Array<ExerciseDef>
}

export const getRoutines = async () => {
    return (await getDocs(collection(db, 'routines'))).docs.map(doc => doc.data()) as Array<Routine>
}

export const getWorkouts = async () => {
    return (await getDocs(collection(db, 'workouts'))).docs.map(doc => doc.data()) as Array<Workout>
}