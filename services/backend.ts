import { User } from "firebase/auth";
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ExerciseDef, Routine, Workout, MuscleGroup } from "./models";

export const getMuscleGroups = async (): Promise<Array<MuscleGroup>> => {
  const muscleGroupsObj = (
    await getDocs(collection(db, "muscle-groups"))
  ).docs.map((doc) => doc.data())[0];
  return Object.keys(muscleGroupsObj).map((key) => ({
    id: parseInt(key),
    name: muscleGroupsObj[key] as string,
  }));
};

export const getExerciseDefs = async (): Promise<Array<ExerciseDef>> => {
  return (await getDocs(collection(db, "exercises"))).docs.map((doc) =>
    doc.data()
    ) as Array<ExerciseDef>;
};

export const getExerciseDef = async (id: string): Promise<ExerciseDef> => {
    return (await getDoc(doc(db, "exercises", id))).data() as ExerciseDef;
};


export const getRoutines = async (): Promise<Array<Routine>> => {
  return (await getDocs(collection(db, "routines"))).docs.map((doc) =>
    doc.data()
  ) as Array<Routine>;
};

export const getWorkouts = async (): Promise<Array<Workout>> => {
  return (await getDocs(collection(db, "workouts"))).docs.map((doc) =>
    doc.data()
  ) as Array<Workout>;
};

export const addExerciseDef = async (exercise: ExerciseDef) => {
  addDoc(collection(db, 'exercises'), exercise);
};

export const updateExerciseDef = async (id: string, exercise: ExerciseDef) => {
  setDoc(doc(db, 'exercises', id), exercise);
};
