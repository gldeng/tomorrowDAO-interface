export enum GovernanceModelType {
  Fixed = 'Fixed',
  Flexible = 'Flexible',
}

type THash = string; // Assuming aelf.Hash is a string type

interface IGovernanceSchemeThreshold {
  minimal_required_threshold: number;
  minimal_vote_threshold: number;
  minimal_approve_threshold: number; // percentage
  maximal_rejection_threshold: number; // percentage
  maximal_abstention_threshold: number; // percentage
}

interface IGovernanceSchemeInput {
  governance_scheme_id?: THash; // Optional because it's not always required
  governance_scheme_threshold?: IGovernanceSchemeThreshold; // Optional because it's not always required
}

interface IHighCouncilConfig {
  max_high_council_member_count: number;
  max_high_council_candidate_count: number;
  election_period: number;
}

interface IHighCouncilInput {
  high_council_config: IHighCouncilConfig;
  is_require_high_council_for_execution: boolean;
}

interface IGovernanceModel {
  governance_scheme_input?: IGovernanceSchemeInput;
  high_council_input?: IHighCouncilInput;
}
