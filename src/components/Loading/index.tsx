'use client';
import { Loading } from 'aelf-design';
import Lottie from 'lottie-react';
import loadingAnimation from 'assets/laoding/loading.json';
import { useCallback, useEffect, useState } from 'react';
const DEFAULT_LOADING_TEXT = 'Loading...';
import myEvents from 'utils/myEvent';

export interface ILoadingInfo {
  isLoading: boolean;
  text: string | React.ReactNode;
}

export default function PageLoading() {
  const [loadingInfo, setLoadingInfo] = useState<ILoadingInfo>({
    isLoading: false,
    text: DEFAULT_LOADING_TEXT,
  });

  const setLoadingHandler = useCallback(({ isLoading, text }: ILoadingInfo) => {
    setLoadingInfo({
      isLoading,
      text: text ?? DEFAULT_LOADING_TEXT,
    });
  }, []);

  useEffect(() => {
    const { remove } = myEvents.SetGlobalLoading.addListener(setLoadingHandler);
    return () => {
      remove();
    };
  }, [setLoadingHandler]);
  return (
    <Loading
      open={loadingInfo.isLoading}
      content={
        <div className="loading-content flex flex-col items-center justify-center">
          <div className="w-5 h-5 mb-2">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
          {!!loadingInfo.text && <div>{loadingInfo.text}</div>}
        </div>
      }
    />
  );
}
