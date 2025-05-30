import { Mic, Weight } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { ExerciseSummary, useExerciseContext } from "src/provider/ExerciseProvider";
import { Button, ListItem, ScrollView, XStack, YGroup } from "tamagui";

export default function WorkoutSummary(props: {} ) {
  let context = useExerciseContext()
  let [rows, setRows] = useState([] as ExerciseSummary[])
  
  useEffect(()=>{
    let func = async () => {
      let res = await context.getAllExercises();
      setRows(res ?? []);
    }; 
    func();
  },[])
  return (
  <ScrollView height={"70%"} children={(
    <YGroup size="$4" px={0}
    children={(
      rows.map((row, key) => (
        <YGroup.Item key={key}>
          <ListItem 
          title={row.exercise} 
          children={row.summary}
          iconAfter={ 
            <XStack gap={"$2"}>
              {row.attributes?.map((a, k)=>(<Button color={} key={k} disabled={true}>{a}</Button>))}
            </XStack>
          }/>
        </YGroup.Item>))
      )}/>
    )}/>
  ); 
}