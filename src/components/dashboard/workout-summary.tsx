import { Mic, Weight } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ExerciseSummary, useExerciseContext } from "src/provider/ExerciseProvider";
import { useJobContext } from "src/provider/JobProvider";
import { Button, ListItem, ScrollView, Spinner, XStack, YGroup } from "tamagui";

export default function WorkoutSummary(props: {} ) {
  let context = useExerciseContext()
  let jobContext = useJobContext();
  let router = useRouter();
  let [rows, setRows] = useState([] as ExerciseSummary[])
  
  async function getAll() {
    let res = await context.getAllExercises();
    console.log("Polled and found this:", res)
    setRows(res ?? []);
    console.log("Clientside jobs: ", jobContext.clientSideJobs)
  }

  const navigateToExercise = (exerciseId: string) => {
    router.push(`/exercise?eid=${exerciseId}`);
  };
useEffect(() => {
    let timeoutId: number  
    const longPoll = async () => {
      try {
        await getAll();
      } finally {
        const delay = 2000;
        timeoutId = setTimeout(longPoll, delay);
      }
    };
    
    longPoll();
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
  
  <ScrollView height={"70%"}>
    <YGroup size="$4" px={0}>
      {jobContext.clientSideJobs.map((job, key) => (
        <YGroup.Item key={key}>
          <ListItem title={job.data?.message || 'Unknown'} children={job.status} iconAfter={Spinner}/>
        </YGroup.Item>
      ))}
    </YGroup>
    <YGroup size="$4" px={0}
      children={(
        rows.map((row, key) => (
          <YGroup.Item key={key}>
            <ListItem 
            title={row.exercise} 
            children={row.summary}
            onPress={() => navigateToExercise(row.id)}
            pressTheme
            iconAfter={ 
              <XStack gap={"$2"}>
                {row.attributes?.map((a, k)=>(<Button key={k} disabled={true}>{a}</Button>))}
              </XStack>
            }/>
          </YGroup.Item>)
        )
    )}/>
  </ScrollView>
  ); 
}