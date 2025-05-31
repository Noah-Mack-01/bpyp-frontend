import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Exercise } from "src/provider/ExerciseProvider";
import {
  YStack,
  XStack,
  Text,
  Card,
  H3,
  Button,
  ScrollView,
  Input,
  TextArea,
  Spinner,
} from 'tamagui';

const exerciseSchema = Yup.object().shape({
  exercise: Yup.string().required('Exercise name is required'),
  summary: Yup.string(),
  sets: Yup.number().min(1, 'Sets must be at least 1').nullable(),
  work: Yup.number().min(0, 'Work must be positive').nullable(),
  workUnit: Yup.string(),
  resistance: Yup.number().min(0, 'Resistance must be positive').nullable(),
  resistanceUnits: Yup.string(),
  duration: Yup.string(),
  attributes: Yup.array().of(Yup.string()),
});

interface ExerciseDetailProps {
  exercise: Exercise;
  onSave?: (updatedExercise: Exercise) => void;
  isEditable?: boolean;
}

export default function ExerciseDetail({ 
  exercise, 
  onSave, 
  isEditable = false 
}: ExerciseDetailProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  
  const initialValues = {
    exercise: exercise.exercise || '',
    summary: exercise.summary || '',
    sets: exercise.sets || null,
    work: exercise.work || null,
    workUnit: exercise.workUnit || '',
    resistance: exercise.resistance || null,
    resistanceUnits: exercise.resistanceUnits || '',
    duration: exercise.duration || '',
    attributes: exercise.attributes || [],
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const updatedExercise: Exercise = {
      ...exercise,
      ...values,
    };
    onSave?.(updatedExercise);
    setIsEditing(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const FormField = ({ 
    label, 
    value, 
    onChangeText, 
    onBlur, 
    error, 
    touched, 
    placeholder,
    keyboardType = 'default',
    multiline = false 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur: () => void;
    error?: string;
    touched?: boolean;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'email-address';
    multiline?: boolean;
  }) => (
    <YStack gap="$2">
      <Text fontSize="$3" fontWeight="500" color="$color">
        {label}
      </Text>
      {multiline ? (
        <TextArea
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          borderColor={touched && error ? '$red10' : '$borderColor'}
          minHeight={80}
        />
      ) : (
        <Input
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
          borderColor={touched && error ? '$red10' : '$borderColor'}
        />
      )}
      {touched && error && (
        <Text color="$red10" fontSize="$2">
          {error}
        </Text>
      )}
    </YStack>
  );

  const DisplayRow = ({ label, value }: { label: string; value?: string | number | null }) => (
    <XStack justifyContent="space-between" alignItems="center" paddingVertical="$2">
      <Text fontSize="$3" fontWeight="500" color="$color11">
        {label}
      </Text>
      <Text fontSize="$3" color="$color" maxWidth="60%" textAlign="right">
        {value ?? 'Not specified'}
      </Text>
    </XStack>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card elevate size="$4" bordered padding="$4" margin="$3">
        <Formik
          initialValues={initialValues}
          validationSchema={exerciseSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
          }) => (
            <YStack gap="$4">
              <YStack gap="$2" alignItems="center">
                <H3 color="$color" textAlign="center">
                  {values.exercise || 'Unnamed Exercise'}
                </H3>
                {isEditable && (
                  <XStack gap="$2">
                    {!isEditing ? (
                      <Button onPress={() => setIsEditing(true)} theme="blue" size="$3">
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onPress={() => handleSubmit()} 
                          disabled={!isValid || isSubmitting}
                          theme="green" 
                          size="$3"
                        >
                          <XStack gap="$2" alignItems="center">
                            {isSubmitting && <Spinner size="small" color="white" />}
                            <Text color="white">
                              {isSubmitting ? 'Saving...' : 'Save'}
                            </Text>
                          </XStack>
                        </Button>
                        <Button 
                          onPress={() => setIsEditing(false)} 
                          theme="gray" 
                          size="$3"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </XStack>
                )}
              </YStack>

              <YStack gap="$3" borderTopWidth={1} borderColor="$borderColor" paddingTop="$3">
                <DisplayRow label="Exercise ID" value={exercise.id} />
                
                {isEditing ? (
                  <>
                    <FormField
                      label="Exercise Name"
                      value={values.exercise}
                      onChangeText={handleChange('exercise')}
                      onBlur={handleBlur('exercise')}
                      error={errors.exercise}
                      touched={touched.exercise}
                      placeholder="Enter exercise name"
                    />
                    
                    <FormField
                      label="Summary"
                      value={values.summary}
                      onChangeText={handleChange('summary')}
                      onBlur={handleBlur('summary')}
                      error={errors.summary}
                      touched={touched.summary}
                      placeholder="Enter exercise summary"
                      multiline
                    />
                    
                    <XStack gap="$3">
                      <YStack flex={1}>
                        <FormField
                          label="Sets"
                          value={values.sets?.toString() || ''}
                          onChangeText={(text) => handleChange('sets')(text ? parseInt(text) || null : null)}
                          onBlur={handleBlur('sets')}
                          error={errors.sets}
                          touched={touched.sets}
                          placeholder="Number of sets"
                          keyboardType="numeric"
                        />
                      </YStack>
                      <YStack flex={1}>
                        <FormField
                          label="Work"
                          value={values.work?.toString() || ''}
                          onChangeText={(text) => handleChange('work')(text ? parseFloat(text) || null : null)}
                          onBlur={handleBlur('work')}
                          error={errors.work}
                          touched={touched.work}
                          placeholder="Work amount"
                          keyboardType="numeric"
                        />
                      </YStack>
                    </XStack>
                    
                    <FormField
                      label="Work Unit"
                      value={values.workUnit}
                      onChangeText={handleChange('workUnit')}
                      onBlur={handleBlur('workUnit')}
                      error={errors.workUnit}
                      touched={touched.workUnit}
                      placeholder="e.g., reps, minutes"
                    />
                    
                    <XStack gap="$3">
                      <YStack flex={1}>
                        <FormField
                          label="Resistance"
                          value={values.resistance?.toString() || ''}
                          onChangeText={(text) => handleChange('resistance')(text ? parseFloat(text) || null : null)}
                          onBlur={handleBlur('resistance')}
                          error={errors.resistance}
                          touched={touched.resistance}
                          placeholder="Resistance"
                          keyboardType="numeric"
                        />
                      </YStack>
                      <YStack flex={1}>
                        <FormField
                          label="Resistance Units"
                          value={values.resistanceUnits}
                          onChangeText={handleChange('resistanceUnits')}
                          onBlur={handleBlur('resistanceUnits')}
                          error={errors.resistanceUnits}
                          touched={touched.resistanceUnits}
                          placeholder="e.g., lbs, kg"
                        />
                      </YStack>
                    </XStack>
                    
                    <FormField
                      label="Duration"
                      value={values.duration}
                      onChangeText={handleChange('duration')}
                      onBlur={handleBlur('duration')}
                      error={errors.duration}
                      touched={touched.duration}
                      placeholder="Exercise duration"
                    />
                  </>
                ) : (
                  <>
                    {values.sets && (
                      <DisplayRow label="Sets" value={values.sets} />
                    )}
                    
                    {values.work && (
                      <DisplayRow 
                        label="Work" 
                        value={`${values.work}${values.workUnit ? ` ${values.workUnit}` : ''}`} 
                      />
                    )}
                    
                    {values.resistance && (
                      <DisplayRow 
                        label="Resistance" 
                        value={`${values.resistance}${values.resistanceUnits ? ` ${values.resistanceUnits}` : ''}`} 
                      />
                    )}
                    
                    {values.duration && (
                      <DisplayRow label="Duration" value={values.duration} />
                    )}
                    
                    {values.summary && (
                      <YStack gap="$2">
                        <Text fontSize="$3" fontWeight="500" color="$color11">
                          Summary
                        </Text>
                        <Text fontSize="$3" color="$color">
                          {values.summary}
                        </Text>
                      </YStack>
                    )}
                  </>
                )}
                
                <DisplayRow label="Timestamp" value={formatDate(exercise.timeStamp)} />
              </YStack>

              {values.attributes && values.attributes.length > 0 && (
                <YStack gap="$2" borderTopWidth={1} borderColor="$borderColor" paddingTop="$3">
                  <Text fontSize="$3" fontWeight="600" color="$color">
                    Attributes
                  </Text>
                  <XStack gap="$2" flexWrap="wrap">
                    {values.attributes.map((attribute, index) => (
                      <Button key={index} size="$2" disabled theme="gray">
                        {attribute}
                      </Button>
                    ))}
                  </XStack>
                </YStack>
              )}
            </YStack>
          )}
        </Formik>
      </Card>
    </ScrollView>
  );
}