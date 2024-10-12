'use client';

import {
  Asset as AssetV1,
  PortkeyAssetProvider as PortkeyAssetProviderV1,
} from '@portkey-v1/did-ui-react';
import {
  Asset as AssetV2,
  PortkeyAssetProvider as PortkeyAssetProviderV2,
} from '@portkey/did-ui-react';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WalletType, WebLoginState, useWebLogin } from 'aelf-web-login';
import { LeftOutlined } from '@ant-design/icons';

import './index.css';

export interface IMyAssetProps {
  redirect?: boolean;
  onBack?: () => void;
}
export default function MyAsset(props: IMyAssetProps) {
  const { redirect = true, onBack } = props;
  const router = useRouter();
  const { wallet, walletType, login, loginState } = useWebLogin();
  const isLogin = loginState === WebLoginState.logined;
  const Asset = AssetV2;
  const PortkeyAssetProvider = PortkeyAssetProviderV2;

  useEffect(() => {
    if (!isLogin && redirect) {
      router.push('/');
    }
  }, [isLogin, router]);

  return (
    <div className={'assets-wrap'}>
      <PortkeyAssetProvider
        originChainId={wallet?.portkeyInfo?.chainId as Chain}
        pin={wallet?.portkeyInfo?.pin}
      >
        <Asset
          isShowRamp={true}
          isShowRampBuy={true}
          isShowRampSell={true}
          backIcon={<LeftOutlined />}
          onOverviewBack={() => {
            if (onBack) {
              onBack();
            } else {
              router.back();
            }
          }}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
