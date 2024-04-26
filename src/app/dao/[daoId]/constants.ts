import { ProposalType } from 'types';
export const ALL = 'ALL';

export const proposalTypeList = [
  { value: ProposalType.ALL, label: 'ALL' },
  {
    value: ProposalType.GOVERNANCE,
    label: 'Governance',
  },
  { value: ProposalType.ADVISORY, label: 'Advisory' },
];

export const proposalStatusList = [
  { value: 'All', label: 'ALL' },
  { value: 'Active', label: 'Active' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Abstained', label: 'Abstained' },
];

export const HC_MEMBER = 'Member';
export const HC_CANDIDATE = 'Candidate';

export const tagMap = {
  proposalType: 'All models',
  governanceMechanism: 'All governanceMechanism',
  proposalStatus: 'All status',
  pagination: '',
  content: '',
};

export const tagColorMap = {
  Active: {
    bgColor: '#FEF7EC',
    textColor: '#F8B042',
    firstText: 'Will expire on',
  },
  Pending: {
    bgColor: '#FEF7EC',
    textColor: '#F8B042',
    firstText: 'Can be vetoed before',
    secondText: 'Being vetoed.',
  },
  Approved: {
    bgColor: '#EBF3FF',
    textColor: '#3888FF',
    firstText: 'Availabe to be executed before',
    secondText: 'Approved on',
  },
  Rejected: {
    bgColor: '#FEEFF1',
    textColor: '#F55D6E',
    firstText: 'Rejected on',
  },
  Abstained: {
    bgColor: '#FEEFF1',
    textColor: '#F55D6E',
    firstText: 'Rejected on',
  },
  Expired: {
    bgColor: '#EDEDED',
    textColor: '#919191',
    firstText: 'Availabe to be executed before',
    secondText: 'Approved on',
  },
  Executed: {
    bgColor: '#E4F8F5',
    textColor: '#05C4A2',
  },
  BelowThreshold: {
    bgColor: '#FEF7EC',
    textColor: '#F8B042',
    firstText: 'Can be vetoed before',
    secondText: 'Being vetoed.',
  },
};
