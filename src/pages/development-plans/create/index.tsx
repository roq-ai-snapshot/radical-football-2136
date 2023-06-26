import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createDevelopmentPlan } from 'apiSdk/development-plans';
import { Error } from 'components/error';
import { developmentPlanValidationSchema } from 'validationSchema/development-plans';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { getPlayers } from 'apiSdk/players';
import { DevelopmentPlanInterface } from 'interfaces/development-plan';

function DevelopmentPlanCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DevelopmentPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDevelopmentPlan(values);
      resetForm();
      router.push('/development-plans');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DevelopmentPlanInterface>({
    initialValues: {
      goals: '',
      milestones: '',
      player_id: (router.query.player_id as string) ?? null,
    },
    validationSchema: developmentPlanValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Development Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="goals" mb="4" isInvalid={!!formik.errors?.goals}>
            <FormLabel>Goals</FormLabel>
            <Input type="text" name="goals" value={formik.values?.goals} onChange={formik.handleChange} />
            {formik.errors.goals && <FormErrorMessage>{formik.errors?.goals}</FormErrorMessage>}
          </FormControl>
          <FormControl id="milestones" mb="4" isInvalid={!!formik.errors?.milestones}>
            <FormLabel>Milestones</FormLabel>
            <Input type="text" name="milestones" value={formik.values?.milestones} onChange={formik.handleChange} />
            {formik.errors.milestones && <FormErrorMessage>{formik.errors?.milestones}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<PlayerInterface>
            formik={formik}
            name={'player_id'}
            label={'Select Player'}
            placeholder={'Select Player'}
            fetcher={getPlayers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.position}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'development_plan',
  operation: AccessOperationEnum.CREATE,
})(DevelopmentPlanCreatePage);
