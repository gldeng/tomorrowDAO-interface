'use client';
import { useSearchParams } from 'next/navigation';
import SceneLoading from './components/Scene/SceneLoading';
import './index.css';
import Slide from './components/Scene/Slide';
import { useEffect, useState } from 'react';
import Main from './components/Main';
import Debug from './Debug';
import { VotigramScene } from './const';
import { preloadImages } from 'utils/file';
import { useConfig } from 'components/CmsGlobalConfig/type';
import InvitedSuccess from './components/InviteedSuccess';
import { TelegramPlatform } from '@portkey/did-ui-react';
import { getReferrerCode } from './util/start-params';

const imageLists = [
  '/images/tg/circular-progress.png',
  '/images/tg/scene-loading.png',
  '/images/tg/gift.png',
  '/images/tg/rank-icon-0.png',
  '/images/tg/rank-icon-1.png',
  '/images/tg/rank-icon-2.png',
  '/images/tg/vote-list-top-banner-1.png',
  '/images/tg/vote-list-top-banner-2.png',
  '/images/tg/empty-vote-list.png',
  '/images/tg/empty-points.png',
  '/images/tg/refer-banner.png',
  '/images/tg/invite-success-vote-tip.png',
];
const mainPageBgColor = '#090816';
export default function Page() {
  const [scene, setScene] = useState<VotigramScene>(VotigramScene.Loading);
  const searchParams = useSearchParams();

  const isDebug = searchParams.get('debug');
  const { voteMain } = useConfig() ?? {};

  const handleShowAppDetail = () => {
    const webapp = window.Telegram.WebApp;
    const button = window?.Telegram?.WebApp?.BackButton;
    button.show();
    webapp.setBackgroundColor('#212121');
  };

  useEffect(() => {
    preloadImages(imageLists);
    preloadImages(voteMain?.topBannerImages ?? []);
  }, []);
  useEffect(() => {
    const webapp = window.Telegram.WebApp;
    const button = webapp?.BackButton;
    const handleBack = () => {
      button.hide();
      webapp.setBackgroundColor(mainPageBgColor);
    };
    button.onClick(handleBack);
    webapp.setBackgroundColor(mainPageBgColor);
    return () => {
      button.offClick(handleBack);
    };
  }, []);

  const enterMainPage = () => {
    const referrerCode = getReferrerCode();
    if (referrerCode) {
      setScene(VotigramScene.InvitedSuccess);
    } else {
      setScene(VotigramScene.Main);
    }
  };

  return (
    <div className="votigram-wrap">
      <div className="line-bg">
        <div className="star-bg"></div>
      </div>
      {scene === VotigramScene.Loading && (
        <SceneLoading
          onFinish={(isAlreadyClaimed?: boolean) => {
            if (isAlreadyClaimed) {
              enterMainPage();
            } else {
              setScene(VotigramScene.Slide);
            }
          }}
        />
      )}
      {scene === VotigramScene.Slide && (
        <Slide
          onFinish={() => {
            enterMainPage();
          }}
        />
      )}
      {scene === VotigramScene.InvitedSuccess && (
        <InvitedSuccess onFinish={() => setScene(VotigramScene.Main)} />
      )}
      {scene === VotigramScene.Main && <Main onShowMore={handleShowAppDetail} />}
      {isDebug && <Debug setScene={setScene} />}
    </div>
  );
}
