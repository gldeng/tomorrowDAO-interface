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

const imageLists = [
  '/images/tg/circular-progress.png',
  '/images/tg/scene-loading.png',
  '/images/tg/gift.png',
  '/images/tg/rank-icon-0.png',
  '/images/tg/rank-icon-1.png',
  '/images/tg/rank-icon-2.png',
  '/images/tg/vote-list-top-banner-1.png',
  '/images/tg/vote-list-top-banner-2.png',
];
export default function Page() {
  const [scene, setScene] = useState<VotigramScene>(VotigramScene.Loading);
  const searchParams = useSearchParams();

  const isDebug = searchParams.get('debug');

  useEffect(() => {
    preloadImages(imageLists);
  }, []);

  return (
    <div className="votigram-wrap">
      <div className="line-bg">
        <div className="star-bg"></div>
      </div>
      {scene === VotigramScene.Loading && (
        <SceneLoading
          onFinish={() => {
            setScene(VotigramScene.Slide);
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
      {scene === VotigramScene.Main && <Main />}
      {isDebug && <Debug setScene={setScene} />}
    </div>
  );
}
