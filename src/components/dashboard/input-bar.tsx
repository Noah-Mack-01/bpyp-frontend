import { Mic } from "@tamagui/lucide-icons";
import { Formik } from "formik"
import { useExerciseContext as useExerciseContext } from "src/provider/ExerciseProvider"
import { useJobContext } from "src/provider/JobProvider";
import { Button, Form, FormTrigger, Input, XStack } from "tamagui"

export default function InputBar() {
  let exerciseContext = useExerciseContext();
  let jobContext = useJobContext();

  async function postMessage(message: string): Promise<void> {
    const jobs = await exerciseContext.postMessage(message);
    if (jobs && jobs.length > 0) {
      jobContext.placeHolder(jobs[0])
    }
  }

  return (
      <Formik
        initialValues={{ message: "" }}
        onSubmit={(values) => postMessage(values.message)}>
          {({values, handleChange, submitForm, resetForm}) => 
        (<Form style={{marginTop: "10px" }}>
          <XStack style={{marginVertical: 10}} gap="$2" justify={"center"}>
          <Input id="message" value={values.message} onChangeText={handleChange("message")} flex={1}/>
          <FormTrigger asChild>
            <Button onMouseLeave={() => {
              submitForm();
            }} icon={Mic} />
          </FormTrigger></XStack>
        </Form>)}
      </Formik>
  )
}