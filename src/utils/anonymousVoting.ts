import { AllProposalStageString, AllProposalStatusString } from 'types';

export function ApplyAnonymousProposalRules(data: IProposalsItem): IProposalsItem {
  const newStatus = NewStatus(data);
  if (newStatus) {
    return {
      ...data,
      proposalStatus: newStatus,
    };
  }
  return data;
}

export function ApplyAnonymousProposalRulesOnProposalDetail(
  data: IProposalDetailData,
): IProposalDetailData {
  const newStatus = NewStatus(data);
  if (newStatus) {
    const proposalLifeList: IProposalLife[] = [
      {
        proposalStage: AllProposalStageString.Active,
        proposalStatus: AllProposalStatusString.PendingCommitment,
      },
    ];
    return {
      ...data,
      proposalLifeList: proposalLifeList,
      proposalStatus: newStatus,
    };
  }
  return data;
}

function NewStatus(data: {
  activeStartTime: string;
  activeEndTime: string;
  isAnonymous: boolean;
}): string | null {
  if (data.isAnonymous) {
    const start = new Date(data.activeStartTime);
    const end = new Date(data.activeEndTime);
    const now = new Date();
    const durationMs = end.getTime() - start.getTime();
    const mid = new Date(start.getTime() + durationMs / 2);
    const isBetweenStartAndMid = now >= start && now < mid;
    if (isBetweenStartAndMid) {
      return AllProposalStatusString.PendingCommitment;
    }
    return null;
  }
  return null;
}
