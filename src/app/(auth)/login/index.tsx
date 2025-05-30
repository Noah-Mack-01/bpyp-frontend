import React from 'react';
import { YStack } from 'tamagui';
import { useRouter } from 'expo-router';
import { LoginComponent } from '../../../components/login';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace('/(restricted)');
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <LoginComponent onSuccess={handleLoginSuccess} />
    </YStack>
  );
}