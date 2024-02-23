export enum ProposalType {
  UNSPECIFIED = 0,
  GOVERNANCE = 1,
  ADVISORY = 2,
}
export interface IContractInfo {
  ContractAddress: string;
  ContractName: string;
  FunctionList: string[];
}

export type TContractInfoList = IContractInfo[];