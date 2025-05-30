import { Redirect, Slot, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useAuth } from "src/provider/AuthProviders";
import ExerciseProvider from "src/provider/ExerciseProvider";

export default function ProtectedLayout() {
  const authContext = useAuth();
  const router = useRouter();
  useEffect(() => {
      if (!!authContext.session) router.push({pathname: "./"});
  }, [authContext])

  return (!authContext.session) ? 
    <Redirect href={"./login"}/> :
    (<ExerciseProvider><Slot /></ExerciseProvider>);
}