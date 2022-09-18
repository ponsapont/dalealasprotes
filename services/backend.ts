import { User } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
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
  return (await getDocs(collection(db, "exercises"))).docs.map((doc) => ({
    ...doc.data(),
    _id: doc.id,
  })) as Array<ExerciseDef>;
};

export const getExerciseDef = async (id: string): Promise<ExerciseDef> => {
  return (await getDoc(doc(db, "exercises", id))).data() as ExerciseDef;
};

export const getRoutines = async (): Promise<Array<Routine>> => {
  return (await getDocs(collection(db, "routines"))).docs.map((doc) => ({
    ...doc.data(),
    _id: doc.id,
  })) as Array<Routine>;
};

export const getRoutine = async (id: string): Promise<Routine> => {
  return (await getDoc(doc(db, "routines", id))).data() as Routine;
};

export const getWorkouts = async (): Promise<Array<Workout>> => {
  return (await getDocs(collection(db, "workouts"))).docs.map((doc) => ({
    ...doc.data(),
    _id: doc.id,
  })) as Array<Workout>;
};

export const addExerciseDef = async (exercise: ExerciseDef) => {
  addDoc(collection(db, "exercises"), exercise);
};

export const addRoutine = async (routine: Routine) => {
  addDoc(collection(db, "routines"), routine);
};

export const updateExerciseDef = async (id: string, exercise: ExerciseDef) => {
  setDoc(doc(db, "exercises", id), exercise);
};

export const updateRoutine = async (id: string, routine: Routine) => {
  setDoc(doc(db, "routines", id), routine);
};