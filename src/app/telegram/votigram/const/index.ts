import { UserTask } from '../type';
export enum VotigramScene {
  Loading = 'loading',
  Slide = 'slide',
  Main = 'main',
  InvitedSuccess = 'invited-success',
}
export const taskTitle: Record<string, string> = {
  [UserTask.Daily]: 'Daily',
  [UserTask.Explore]: 'Explore',
};
