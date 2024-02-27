import { FormInstance } from "antd";
import { create } from "domain";
import { createContext } from "react";

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
export interface IMetadata {
  name: string;
  logo_url: string;
  description: string; // 240
  social_media: Record<string, string>; // Twitter, Facebook, Discord, Telegram, Reddit
}
export interface IFile {
  cid: string; // id
  name: string; //
  url: string; //
}
// DAO create params
export interface ICreateDAOInput {
  // step 0
  metadata: IMetadata;
  governance_token: string;
  // step 1
  governance_scheme_threshold: IGovernanceSchemeThreshold;
  // step 2 optional
  high_council_input: IHighCouncilInput;
  // step 3
  files: IFile[];
}
export enum StepEnum {
  step0 = '0',
  step1 = '1',
  step2 = '2',
  step3 = '3',
}
export interface BasicInfoSubmitedRes {
  metadata: IMetadata;
  governance_token: string;
}
export interface GovernanceSchemeSubmitedRes {
  governance_scheme_threshold: IGovernanceSchemeThreshold;
}
export interface HighCouncilSubmitedRes {
  high_council_input: IHighCouncilInput;
}
export interface FilesSubmitedRes {
  files: IFile[];
}
interface StepsFormMap {
  [StepEnum.step0]: {
    submitedRes?: BasicInfoSubmitedRes;
    formInstance?: FormInstance;
  };
  [StepEnum.step1]: {
    submitedRes?: GovernanceSchemeSubmitedRes;
    formInstance?: FormInstance;
  };
  [StepEnum.step2]: {
    submitedRes?: HighCouncilSubmitedRes;
    formInstance?: FormInstance;
  };
  [StepEnum.step3]: {
    submitedRes?: FilesSubmitedRes;
    formInstance?: FormInstance;
  };
}
export const defaultStepsFormMap = {
  stepForm: {
    [StepEnum.step0]: {},
    [StepEnum.step1]: {},
    [StepEnum.step2]: {},
    [StepEnum.step3]: {},
  },
};
export interface IStepsContext {
  stepForm: StepsFormMap;
  onLoad?: (ins: FormInstance) => void;
}
export const StepsContext = createContext<IStepsContext>(defaultStepsFormMap);
