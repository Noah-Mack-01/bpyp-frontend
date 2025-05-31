import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { YStack, Text, Spinner, Card, XStack, Button } from 'tamagui';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { Exercise, useExerciseContext } from 'src/provider/ExerciseProvider';
import ExerciseDetail from 'src/components/details/exercise-detail';

export default function ExerciseDetailPage() {
  const { eid } = useLocalSearchParams<{ eid: string }>();
  const { getExercise, loading, error } = useExerciseContext();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!eid) {
        setFetchError('No exercise ID provided');
        return;
      }

      try {
        const exerciseData = await getExercise(eid);
        setExercise(exerciseData);
        setFetchError(null);
      } catch (err) {
        console.error('Failed to fetch exercise:', err);
        setFetchError('Failed to load exercise details');
      }
    };

    fetchExercise();
  }, [eid]);

  const handleSave = async (updatedExercise: Exercise) => {
    // Here you would typically call an update API
    console.log('Exercise updated:', updatedExercise);
    setExercise(updatedExercise);
  };

  if (!eid) {
    return (
      <YStack flex={1} justify="center" verticalAlign="center" p="$4">
        <Card padding="$4" bordered>
          <Text fontSize="$4" color="$red10" verticalAlign="center">
            No exercise ID provided in URL
          </Text>
        </Card>
      </YStack>
    );
  }

  if (loading) {
    console.log("Loading!");
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
        <Text fontSize="$4" color="$color11" marginTop="$2">
          Loading exercise details...
        </Text>
      </YStack>
    );
  }

  if (error || fetchError) {
    console.log("error!")
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Card padding="$4" bordered>
          <Text fontSize="$4" color="$red10" textAlign="center">
            {fetchError || error}
          </Text>
        </Card>
      </YStack>
    );
  }

  if (!exercise) {

    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Card padding="$4" bordered>
          <Text fontSize="$4" color="$color11" textAlign="center">
            Exercise not found
          </Text>
        </Card>
      </YStack>
    );
  }
  console.log("Exercise good!")
  return (
    <YStack flex={1}>
      <XStack padding="$3" alignItems="center" gap="$3" borderBottomWidth={1} borderColor="$borderColor">
        <Button
          size="$3"
          chromeless
          onPress={() => router.back()}
          icon={ArrowLeft}
          aria-label="Go back"
        />
        <Text fontSize="$5" fontWeight="600" color="$color">
          Exercise Details
        </Text>
      </XStack>
      <ExerciseDetail 
        exercise={exercise} 
        onSave={handleSave}
        isEditable={false}
      />
    </YStack>
  );
}