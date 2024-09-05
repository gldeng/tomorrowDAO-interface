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
import AppDetail from './components/AppDetail';

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
];
const mainPageBgColor = '#090816';
export default function Page() {
  const [scene, setScene] = useState<VotigramScene>(VotigramScene.Loading);
  const [currentItem, setCurrentItem] = useState<IRankingListResItem | null>(null);
  const [isShowAppDetail, setIsShowAppDetail] = useState(false);
  const searchParams = useSearchParams();

  const isDebug = searchParams.get('debug');

  const handleShowAppDetail = (item: IRankingListResItem) => {
    const webapp = window.Telegram.WebApp;
    setCurrentItem(item);
    setIsShowAppDetail(true);
    const button = window?.Telegram?.WebApp?.BackButton;
    button.show();
    webapp.setBackgroundColor('#212121');
  };

  useEffect(() => {
    preloadImages(imageLists);
  }, []);
  useEffect(() => {
    const webapp = window.Telegram.WebApp;
    const button = webapp?.BackButton;
    const handleBack = () => {
      setIsShowAppDetail(false);
      button.hide();
      webapp.setBackgroundColor(mainPageBgColor);
    };
    button.onClick(handleBack);
    webapp.setBackgroundColor(mainPageBgColor);
    return () => {
      button.offClick(handleBack);
    };
  }, []);

  return (
    <div className="votigram-wrap">
      <div className="line-bg">
        <div className="star-bg"></div>
      </div>
      {scene === VotigramScene.Loading && (
        <SceneLoading
          onFinish={(isAlreadyClaimed?: boolean) => {
            if (isAlreadyClaimed) {
              setScene(VotigramScene.Main);
            } else {
              setScene(VotigramScene.Slide);
            }
          }}
        />
      )}
      {scene === VotigramScene.Slide && (
        <Slide
          onFinish={() => {
            setScene(VotigramScene.Main);
          }}
        />
      )}
      {scene === VotigramScene.Main && <Main onShowMore={handleShowAppDetail} />}
      <AppDetail item={currentItem} style={{ display: isShowAppDetail ? 'block' : 'none' }} />
      {isDebug && <Debug setScene={setScene} />}
    </div>
  );
}
