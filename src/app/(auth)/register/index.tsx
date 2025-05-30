import React from 'react';
import { YStack } from 'tamagui';
import { useRouter } from 'expo-router';
import { RegisterComponent } from '../../../components/register';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    router.replace('/(restricted)');
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <RegisterComponent onSuccess={handleRegisterSuccess} />
    </YStack>
  );
}