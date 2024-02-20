export enum GovernanceModelType {
  Fixed = 'Fixed',
  Flexible = 'Flexible',
}

type Hash = string; // Assuming aelf.Hash is a string type

interface GovernanceSchemeThreshold {
  minimal_required_threshold: number;
  minimal_vote_threshold: number;
  minimal_approve_threshold: number; // percentage
  maximal_rejection_threshold: number; // percentage
  maximal_abstention_threshold: number; // percentage
}

interface GovernanceSchemeInput {
  governance_scheme_id?: Hash; // Optional because it's not always required
  governance_scheme_threshold?: GovernanceSchemeThreshold; // Optional because it's not always required
}

interface HighCouncilConfig {
  max_high_council_member_count: number;
  max_high_council_candidate_count: number;
  election_period: number;
}

interface HighCouncilInput {
  high_council_config: HighCouncilConfig;
  is_require_high_council_for_execution: boolean;
}

interface GovernanceModel {
  governance_scheme_input?: GovernanceSchemeInput;
  high_council_input?: HighCouncilInput;
}
