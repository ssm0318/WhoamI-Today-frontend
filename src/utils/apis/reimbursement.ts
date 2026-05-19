import { ReimbursementState } from '@models/reimbursement';

import { REIMBURSEMENT_POINTS_TBU } from '../reimbursementAvailability';
import axios from './axios';

export const REIMBURSEMENT_KEY = '/surveys/reimbursement/';

export const getReimbursementState = async (): Promise<ReimbursementState | null> => {
  if (REIMBURSEMENT_POINTS_TBU) return null;

  const { data } = await axios.get<ReimbursementState>(REIMBURSEMENT_KEY);
  return data;
};
