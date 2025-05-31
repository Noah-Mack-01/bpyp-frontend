import { createContext, useContext, useState, useEffect } from "react"
import { JOB_API, EXERCISE_API, Job } from "../api/supabase"


export type JobContext = {
  loading: boolean,
  error: any,
  clientSideJobs: Job[],
  refresh: () => Promise<boolean>,
  timeoutJob: (jobId: string) => Promise<void>,
  placeHolder: (job: Job) => void;
}

const JobContext = createContext(null as JobContext | null) 


export default function JobProvider({children}:any) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any | null>(null)
  const [pending, setPending] = useState([] as Job[])


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
  
  async function refresh(): Promise<boolean> {
    const pendingJobs = await JOB_API.getPendingJobs();
    console.log("Found these pending jobs....", pendingJobs);
    // Completely overwrite the pending jobs array
    setPending(pendingJobs); 
    
    return true;
  }

  function placeHolder(job: Job): void {
    setPending([...pending, job]);
  }

  async function timeoutJob(jobId: string): Promise<void> {
    await JOB_API.timeoutJob(jobId);
    setPending(prev => prev.filter(job => job.id !== jobId));
  }


  useEffect(() => {
    let timeoutId: number  
    const longPoll = async () => {
      try {
        await refresh();
      } finally {
        const delay = 2000;
        timeoutId = setTimeout(longPoll, delay);
      }
    };
    
    console.log("Beginning long polling....");
    longPoll();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return <JobContext.Provider value={{
    refresh: methodWrapper(refresh),
    timeoutJob: methodWrapper(timeoutJob),
    
    clientSideJobs: pending,
    loading: isLoading,
    error: error,
    placeHolder: placeHolder,
  }} children={children}/>
}

export function useJobContext() {
  const context = useContext(JobContext);
  if (context === null) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
}