import { useExerciseContext } from "src/provider/ExerciseProvider"
import { __values } from "tslib"
import InputBar from "src/components/dashboard/input-bar"
import WorkoutSummary from "src/components/dashboard/workout-summary"
import { YStack } from "tamagui"
export default function Index() {
  let exerciseContext = useExerciseContext()

  return (
    <YStack width={"90%"} height={"100%"} style={{alignSelf:"center"}}>
      <InputBar/>
      <WorkoutSummary/>
    </YStack>
  )
}