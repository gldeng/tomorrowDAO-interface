'use client';
import SceneLoading from './components/Scene/SceneLoading';
import './index.css';
import Slide from './components/Scene/Slide';
import { useState } from 'react';
import Main from './components/Main';

enum VotigramScene {
  Loading = 'loading',
  Slide = 'slide',
  Main = 'main',
}
export default function Page() {
  const [scene, setScene] = useState<VotigramScene>(VotigramScene.Loading);
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
      <div className="fixed z-50 left-0 bottom-0">
        <button
          onClick={() => {
            setScene(VotigramScene.Loading);
          }}
        >
          Loading
        </button>
        <button
          onClick={() => {
            setScene(VotigramScene.Slide);
          }}
        >
          slide
        </button>
        <button
          onClick={() => {
            setScene(VotigramScene.Main);
          }}
        >
          Main
        </button>
      </div>

      {/* <CommonDrawer
        title="hello world"
        body={
          <div>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ul>
            <Button type="primary">hello world</Button>
          </div>
        }
      /> */}
    </div>
  );
}
