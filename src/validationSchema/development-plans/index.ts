import * as yup from 'yup';

export const developmentPlanValidationSchema = yup.object().shape({
  goals: yup.string().required(),
  milestones: yup.string().required(),
  player_id: yup.string().nullable().required(),
});
