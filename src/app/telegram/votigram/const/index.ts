import { UserTask } from '../type';
export enum VotigramScene {
  Loading = 'loading',
  Slide = 'slide',
  Main = 'main',
  InvitedSuccess = 'invited-success',
}
export const taskTitle: Record<
  string,
  {
    title: string;
    icon: string;
  }
> = {
  [UserTask.Daily]: {
    title: 'Daily',
    icon: '/images/tg/smile-emoji-icon.png',
  },
  [UserTask.Explore]: {
    title: 'Explore',
    icon: '/images/tg/gift-icon.png',
  },
};
