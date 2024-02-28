import { ChainId } from '@portkey/types';
import { IPaginationProps } from 'aelf-design';

export enum TVotingOption {
  Approved = 'Approved',
  Rejected = 'Rejected',
  Abstained = 'Abstained',
}
export interface IVotingResult {
  chainId: ChainId;
  transactionId: string;
  voter: string;
  amount: number;
  voteOption: TVotingOption;
  voteTime: string;
}

export interface ITableProps {
  pagination: IPaginationProps;
}
