export enum GovernanceModelType {
  Fixed = 'Fixed',
  Flexible = 'Flexible',
}

export interface IGovernanceSchemeThreshold {
  minimal_required_threshold: number;
  minimal_vote_threshold: number;
  minimal_approve_threshold: number; // percentage
  maximal_rejection_threshold: number; // percentage
  maximal_abstention_threshold: number; // percentage
}

export interface IHighCouncilConfig {
  max_high_council_member_count: number;
  max_high_council_candidate_count: number;
  election_period: number;
}

export interface IHighCouncilInput {
  high_council_config: IHighCouncilConfig;
  governance_scheme_threshold: IGovernanceSchemeThreshold;
}
// DAO create params
interface ICreateDAOInput {
  // step 2
  governance_scheme_threshold: IGovernanceSchemeThreshold;
  // step 3
  high_council_input: IHighCouncilInput;
}
