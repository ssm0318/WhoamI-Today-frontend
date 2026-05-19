import { ReimbursementState } from '@models/reimbursement';

import axios from './axios';

export const REIMBURSEMENT_KEY = '/surveys/reimbursement/';

export const getReimbursementState = async (): Promise<ReimbursementState> => {
  const { data } = await axios.get<ReimbursementState>(REIMBURSEMENT_KEY);
  return data;
};
