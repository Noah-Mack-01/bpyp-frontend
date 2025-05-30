import { useEffect, useState } from "react"
import { Formik } from "formik"
import { ExerciseSummary, useExerciseSummary } from "src/provider/ExerciseProvider"
import { ObjectSchema } from "yup"

export default function Index() {
  let summaryContext = useExerciseSummary()
  let [rows, setRows] = useState([] as ExerciseSummary[])
  
  useEffect(()=>{
    let func = async () => {
      let res = await summaryContext.getAllExercises();
      setRows(res ?? []);
    };
    
    func();
  },[])

  return (
    <div>
      <Formik
        initialValues={{ message: "" }}
        onSubmit={async (values, { resetForm }) => {
          if (values.message.trim()) {
            await summaryContext.postMessage(values.message)
            resetForm()
          }
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="message"
              value={values.message}
              onChange={handleChange}
              placeholder="Enter your message..."
              style={{ padding: '8px', marginRight: '8px', width: '300px' }}
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </Formik>
      <ul>{rows.map((row, key) => <li key={key}>{JSON.stringify(row)}</li>)}</ul>
    </div>
  )
}