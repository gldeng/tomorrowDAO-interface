import { Button, HashAddress } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';
import { useWalletService } from 'hooks/useWallet';
import { ReactComponent as AvatarIcon } from 'assets/imgs/avatar-icon.svg';
import './index.css';
import { useSelector } from 'react-redux';
import { WalletType, useWebLogin } from 'aelf-web-login-dao';
import { useMemo } from 'react';
import { Popover } from 'antd';

export default function Login() {
  const { isLG } = useResponsive();
  const { logout } = useWebLogin();
  const { login, isLogin, walletType } = useWalletService();
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const info = useSelector((store: any) => store.elfInfo.elfInfo);
  const logoutEvent = () => {
    logout();
  };
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
        <Button size={isLG ? 'medium' : 'large'} type="primary" onClick={login}>
          Log In
        </Button>
      ) : (
        <Popover
          placement="bottomRight"
          overlayClassName="user-popover"
          arrow={false}
          trigger="click"
          content={
            <div className="logout-container">
              <div className="user-chain">SideChain {info.curChain}</div>
              <div className="mb-6">
                <HashAddress size="small" chain={info.curChain} address={walletInfo.address} />
              </div>
              <div className="logout-button" onClick={logoutEvent}>
                Log Out
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
