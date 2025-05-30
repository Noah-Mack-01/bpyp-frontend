import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  YStack,
  XStack,
  Input,
  Button,
  Text,
  Card,
  H2,
  Spinner,
} from 'tamagui';
import { useAuth, Credentials } from '../provider/AuthProviders';

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

interface RegisterFormValues extends Credentials {
  confirmPassword: string;
}

interface RegisterComponentProps {
  onSuccess?: () => void;
  showTitle?: boolean;
}

export const RegisterComponent: React.FC<RegisterComponentProps> = ({
  onSuccess,
  showTitle = true,
}) => {
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await register({ email: values.email, password: values.password });
      onSuccess?.();
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <Card elevate size="$4" bordered padding="$4" minWidth={300}>
      <YStack gap="$4">
        {showTitle && (
          <H2 color="$color">
            Create Account
          </H2>
        )}

        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <YStack gap="$3">
              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500">
                  Email
                </Text>
                <Input
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  borderColor={
                    touched.email && errors.email ? '$red10' : '$borderColor'
                  }
                />
                {touched.email && errors.email && (
                  <Text color="$red10" fontSize="$2">
                    {errors.email}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500">
                  Password
                </Text>
                <Input
                  placeholder="Enter your password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                  borderColor={
                    touched.password && errors.password
                      ? '$red10'
                      : '$borderColor'
                  }
                />
                {touched.password && errors.password && (
                  <Text color="$red10" fontSize="$2">
                    {errors.password}
                  </Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="500">
                  Confirm Password
                </Text>
                <Input
                  placeholder="Confirm your password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  secureTextEntry
                  borderColor={
                    touched.confirmPassword && errors.confirmPassword
                      ? '$red10'
                      : '$borderColor'
                  }
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text color="$red10" fontSize="$2">
                    {errors.confirmPassword}
                  </Text>
                )}
              </YStack>

              {error && (
                <Text color="$red10" fontSize="$3">
                  {error}
                </Text>
              )}

              <Button
                onPress={() => handleSubmit()}
                disabled={!isValid || isLoading}
                theme="green"
                size="$4"
              >
                <XStack gap="$2">
                  {isLoading && <Spinner size="small" color="white" />}
                  <Text color="white" fontWeight="600">
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </XStack>
              </Button>
            </YStack>
          )}
        </Formik>
      </YStack>
    </Card>
  );
};