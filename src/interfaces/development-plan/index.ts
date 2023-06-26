import { PlayerInterface } from 'interfaces/player';
import { GetQueryInterface } from 'interfaces';

export interface DevelopmentPlanInterface {
  id?: string;
  goals: string;
  milestones: string;
  player_id: string;
  created_at?: any;
  updated_at?: any;

  player?: PlayerInterface;
  _count?: {};
}

export interface DevelopmentPlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  goals?: string;
  milestones?: string;
  player_id?: string;
}
