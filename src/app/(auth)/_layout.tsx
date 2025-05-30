import { Redirect, Stack } from "expo-router";
import { useAuth } from "src/provider/AuthProviders";

export default function AuthLayout() {
  const authContext = useAuth();
  return (authContext.session) ? <Redirect href={`/`}/> : <Stack />;
}