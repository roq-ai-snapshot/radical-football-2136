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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getDevelopmentPlanById, updateDevelopmentPlanById } from 'apiSdk/development-plans';
import { Error } from 'components/error';
import { developmentPlanValidationSchema } from 'validationSchema/development-plans';
import { DevelopmentPlanInterface } from 'interfaces/development-plan';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { getPlayers } from 'apiSdk/players';

function DevelopmentPlanEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DevelopmentPlanInterface>(
    () => (id ? `/development-plans/${id}` : null),
    () => getDevelopmentPlanById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DevelopmentPlanInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDevelopmentPlanById(id, values);
      mutate(updated);
      resetForm();
      router.push('/development-plans');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DevelopmentPlanInterface>({
    initialValues: data,
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
            Edit Development Plan
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'development_plan',
  operation: AccessOperationEnum.UPDATE,
})(DevelopmentPlanEditPage);
