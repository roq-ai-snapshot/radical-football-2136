import { DevelopmentPlanInterface } from 'interfaces/development-plan';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PlayerInterface {
  id?: string;
  age: number;
  position: string;
  skill_level: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;
  development_plan?: DevelopmentPlanInterface[];
  user?: UserInterface;
  _count?: {
    development_plan?: number;
  };
}

export interface PlayerGetQueryInterface extends GetQueryInterface {
  id?: string;
  position?: string;
  skill_level?: string;
  user_id?: string;
}
