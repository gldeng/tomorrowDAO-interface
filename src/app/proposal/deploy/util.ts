import { ProposalType, TContractInfoList } from './type';
export const proposalTypeList = [
  {
    label: 'Governance',
    desc: 'Enact changes to smart contracts of the DAO. Once approved, an on-chain execution is required.',
    value: ProposalType.GOVERNANCE,
  },
  {
    label: 'Advisory',
    desc: "Offer guidance and suggestions for the DAO's future direction, do not directly result in on-chain actions.",
    value: ProposalType.ADVISORY,
  },
];
export const voteSchemeIds = [
  {
    value: '1t1v',
    label: 'One Token One Vote',
  },
  {
    value: '1a1v',
    label: 'One Address One Vote',
  },
];
export const contractInfoList: TContractInfoList = [
  {
    ContractAddress: "address1",
    ContractName: "name1",
    FunctionList: ["a1", "b1", "c1"]
  },
  {
    ContractAddress: "address2",
    ContractName: "name2",
    FunctionList: ["a2", "b2", "c2"]
  },
  {
    ContractAddress: "address3",
    ContractName: "name3",
    FunctionList: ["a3", "b3", "c3"]
  },
  {
    ContractAddress: "address4",
    ContractName: "name4",
    FunctionList: ["a4", "b4", "c4"]
  }
];