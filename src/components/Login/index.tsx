import { Button, HashAddress } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';
import { useCheckLoginAndToken, useWalletService } from 'hooks/useWallet';
import { useSelector } from 'redux/store';
import {
  ExitOutlined,
  InfoCircleOutlined,
  UserProfileOutlined,
  WalletOutlined,
} from '@aelf-design/icons';
import { ReactComponent as AvatarIcon } from 'assets/imgs/avatar-icon.svg';
import { WalletType, WebLoginState, useWebLogin } from 'aelf-web-login';
import { useMemo } from 'react';
import { Popover } from 'antd';
import Link from 'next/link';
import './index.css';
import { explorer } from 'config';
export const LoginAuth = () => {
  const { isLG } = useResponsive();
  const { loginState, login } = useWebLogin();
  const { getTokenUpdate } = useCheckLoginAndToken();
  const isConnectWallet = useMemo(() => loginState === WebLoginState.logined, [loginState]);
  if (isConnectWallet) {
    return (
      <Button size={isLG ? 'medium' : 'large'} type="primary" onClick={getTokenUpdate}>
        Authorization
      </Button>
    );
  }
  return (
    <Button size={isLG ? 'medium' : 'large'} type="primary" onClick={login}>
      Log in
    </Button>
  );
};
export default function Login() {
  const { isLG } = useResponsive();
  const { logout, loginState } = useWebLogin();
  const { login, isLogin, walletType } = useWalletService();
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const info = useSelector((store: any) => store.elfInfo.elfInfo);
  const logoutEvent = () => {
    logout();
  };
  const isPortkeyLogin = walletType === WalletType.portkey && loginState === WebLoginState.logined;
  const userName = useMemo(() => {
    if (walletInfo) {
      if (walletType === WalletType.discover) {
        return walletInfo?.discoverInfo?.nickName;
      } else if (walletType === WalletType.portkey) {
        return walletInfo?.portkeyInfo?.nickName;
      } else if (walletType === WalletType.elf) {
        return walletInfo?.nightElfInfo?.name;
      }
      return walletInfo.name;
    }
    return '';
  }, [walletInfo, walletType]);
  return (
    <div className="login-container">
      {!isLogin ? (
        <LoginAuth />
      ) : (
        <Popover
          placement={'bottomRight'}
          overlayClassName="user-popover"
          arrow={false}
          trigger="click"
          content={
            <div className="header-dropdown-container">
              <Link href={`${explorer}/address/${walletInfo.address}`} target="_blank">
                <div className="drop-down-items">
                  <span className="prefix-icon">
                    <InfoCircleOutlined />
                  </span>
                  <HashAddress
                    size="small"
                    chain={info.curChain}
                    address={walletInfo.address}
                    preLen={8}
                    endLen={9}
                  />
                </div>
              </Link>
              {isPortkeyLogin && (
                <Link href={'/assets'}>
                  <div className="drop-down-items">
                    <span className="prefix-icon">
                      <WalletOutlined />
                    </span>
                    My Assets
                  </div>
                </Link>
              )}
              <Link href={'/my-daos'}>
                <div className="drop-down-items">
                  <span className="prefix-icon">
                    <UserProfileOutlined />
                  </span>
                  My DAOs
                </div>
              </Link>
              <div className="drop-down-items" onClick={logoutEvent}>
                <span className="prefix-icon">
                  <ExitOutlined />
                </span>
                <span>Log out</span>
              </div>
            </div>
          }
        >
          <div className="user-info">
            <div className="avatar-container">
              <AvatarIcon width={12} height={12} />
            </div>
            <div className="user-name">{userName}</div>
          </div>
        </Popover>
      )}
    </div>
  );
}
