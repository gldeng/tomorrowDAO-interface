export interface IStartAppParams {
  referralCode?: string;
  source?: string;
}

export enum UserTask {
  Daily = 'Daily',
  Explore = 'Explore',
}

export enum UserTaskDetail {
  // Daily
  DailyVote = 'DailyVote',
  DailyFirstInvite = 'DailyFirstInvite',
  DailyViewAsset = 'DailyViewAsset',

  // Explore
  ExploreJoinTgChannel = 'ExploreJoinTgChannel',
  ExploreFollowX = 'ExploreFollowX',
  ExploreJoinDiscord = 'ExploreJoinDiscord',
  ExploreForwardX = 'ExploreForwardX',
  ExploreCumulateFiveInvite = 'ExploreCumulateFiveInvite',
  ExploreCumulateTenInvite = 'ExploreCumulateTenInvite',
  ExploreCumulateTwentyInvite = 'ExploreCumulateTwentyInvite',
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

export enum IPonitType {
  TopInviter = 'TopInviter',
}
