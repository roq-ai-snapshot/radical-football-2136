import * as yup from 'yup';

export const playerValidationSchema = yup.object().shape({
  age: yup.number().integer().required(),
  position: yup.string().required(),
  skill_level: yup.string().required(),
  user_id: yup.string().nullable().required(),
});
