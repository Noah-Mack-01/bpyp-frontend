import { Redirect, Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "src/provider/AuthProviders";
import ExerciseProvider from "src/provider/ExerciseProvider";
import JobProvider from "src/provider/JobProvider";

export default function ProtectedLayout() {
  const authContext = useAuth();
  const router = useRouter();
  useEffect(() => {
      if (!!authContext.session) router.push({pathname: "./"});
  }, [authContext])

  return (!authContext.session) ? 
    <Redirect href={"./login"}/> :
    (
    <ExerciseProvider>
      <JobProvider>
        <Slot />
      </JobProvider>
    </ExerciseProvider>
    );
}