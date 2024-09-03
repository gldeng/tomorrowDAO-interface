export interface IWsPointsItem {
  id: string;
  proposalId: string;
  alias: string;
  points: number;
}

export interface IPointsListRes {
  pointsList: IWsPointsItem[];
}
