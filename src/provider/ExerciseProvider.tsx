import { createContext, useContext, useState } from "react"
import { EXERCISE_API } from "src/api/supabase"

export type ExerciseSummary = {
  id: string,
  exercise?: string,
  summary?: string,
  attributes?: string[]
}

export type Exercise = ExerciseSummary & {
  sets?: number,
  work?: number,
  workUnit?: string
  resistance?: number,
  resistanceUnits?: string
  duration?: string,
  timeStamp?: Date
}

export type ExerciseSummaryContext = {
  loading: boolean,
  detailLoading: boolean,
  error: any,
  getAllExercises: () => Promise<ExerciseSummary[]>,
  getExercise: (id: string) => Promise<Exercise>
  postMessage: (message: string) => Promise<any[]>
}


const ExerciseContext = createContext(null as ExerciseSummaryContext | null)
export default function ExerciseProvider({children}:any) {
  const [detailLoading, setDetailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any | null>(null)
  function methodWrapper(func: (...obj: any[]) => Promise<any>): (...obj: any[]) => Promise<any> {  
    return async (...obj: any[]) => {
      setIsLoading(true);
      setError(null);
      try {
        return await func(...obj??[]);
      } catch (err) {
        setError(err);
        console.error(`${func.name} failed`, err);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return <ExerciseContext.Provider value={{
    loading: isLoading,
    detailLoading,
    error: error,
    getAllExercises: methodWrapper(EXERCISE_API.getSummary),
    getExercise: methodWrapper(EXERCISE_API.getExercise),
    postMessage: methodWrapper(EXERCISE_API.postMessage),
  }} children={children}/>
}

export function useExerciseContext() {
  const context = useContext(ExerciseContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}