import axios from 'axios';
import queryString from 'query-string';
import { DevelopmentPlanInterface, DevelopmentPlanGetQueryInterface } from 'interfaces/development-plan';
import { GetQueryInterface } from '../../interfaces';

export const getDevelopmentPlans = async (query?: DevelopmentPlanGetQueryInterface) => {
  const response = await axios.get(`/api/development-plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDevelopmentPlan = async (developmentPlan: DevelopmentPlanInterface) => {
  const response = await axios.post('/api/development-plans', developmentPlan);
  return response.data;
};

export const updateDevelopmentPlanById = async (id: string, developmentPlan: DevelopmentPlanInterface) => {
  const response = await axios.put(`/api/development-plans/${id}`, developmentPlan);
  return response.data;
};

export const getDevelopmentPlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/development-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDevelopmentPlanById = async (id: string) => {
  const response = await axios.delete(`/api/development-plans/${id}`);
  return response.data;
};
