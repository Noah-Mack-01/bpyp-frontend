import { createContext, useContext, useState } from "react"
import { EXERCISE_API } from "src/api/supabase"

export type ExerciseSummary = {
  id: string,
  exercise?: string,
  summary?: string,
}

export type ExerciseSummaryContext = {
  loading: boolean,
  error: any,
  getAllExercises: () => Promise<ExerciseSummary[]>,
  getExercise?: (id: string) => Promise<ExerciseSummary>
  postMessage: (messsge: string) => Promise<void>
}


const ExerciseContext = createContext(null as ExerciseSummaryContext | null)
export default function ExerciseSummaryProvider({children}:any) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any | null>(null)

  function methodWrapper<T>(func: (...obj: any[]) => Promise<any>): (...obj: any[]) => Promise<any> {  
    return async (...obj: any[]) => {
      console.log(obj);
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
    error: error,
    getAllExercises: methodWrapper(EXERCISE_API.getSummary),
    postMessage: methodWrapper(EXERCISE_API.postMessage)
  }} children={children}/>
}

export function useExerciseSummary() {
  const context = useContext(ExerciseContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}