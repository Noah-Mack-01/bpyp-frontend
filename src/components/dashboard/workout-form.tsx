import { Mic } from "@tamagui/lucide-icons";
import { Formik } from "formik"
import { useExerciseContext as useExerciseContext } from "src/provider/ExerciseProvider"
import { Button, Form, FormTrigger, Input, XStack } from "tamagui"

export default function WorkoutForm() {
  let exerciseContext = useExerciseContext();
  return (
      <Formik
        initialValues={{ message: "" }}
        onSubmit={(values) => exerciseContext.postMessage(values.message)}>
          {({values, handleChange, submitForm, resetForm}) => 
        (<Form style={{marginTop: "10px" }}>
          <XStack style={{marginVertical: 10}} gap="$2" justify={"center"}>
          <Input id="message" value={values.message} onChangeText={handleChange("message")} flex={1}/>
          <FormTrigger asChild>
            <Button onMouseLeave={() => {
              submitForm();
              values.message = ""
            }} icon={Mic} />
          </FormTrigger></XStack>
        </Form>)}
      </Formik>
  )
}