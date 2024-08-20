'use client';
import { useSearchParams } from 'next/navigation';
import SceneLoading from './components/Scene/SceneLoading';
import './index.css';
import Slide from './components/Scene/Slide';
import { useState } from 'react';
import Main from './components/Main';
import Debug from './Debug';
import { VotigramScene } from './const';

export default function Page() {
  const [scene, setScene] = useState<VotigramScene>(VotigramScene.Loading);
  const searchParams = useSearchParams();

  const isDebug = searchParams.get('debug');

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
