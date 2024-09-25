export interface IStartAppParams {
  referralCode?: string;
  source?: string;
}

export enum UserTask {
  Daily = 0,
  Explore = 1,
}

export enum UserTaskDetail {
  // Daily
  DailyVote = 0,
  DailyFirstInvite = 1,
  DailyViewAsset = 2,

  // Explore
  ExploreJoinTgChannel = 3,
  ExploreFollowX = 4,
  ExploreJoinDiscord = 5,
  ExploreCumulateFiveInvite = 6,
  ExploreCumulateTenInvite = 7,
  ExploreCumulateTwentyInvite = 8,
}
export enum ITabSource {
  Vote = 0,
  Task = 1,
  Referral = 2,
  Asset = 3,
}
export interface IStackItem {
  path: number;
  source?: ITabSource;
}
