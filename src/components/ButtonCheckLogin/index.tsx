import { Button, IButtonProps } from 'aelf-design';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export const ButtonCheckLogin: React.FC<IButtonProps> = (props) => {
  const { walletInfo: wallet, connectWallet } = useConnectWallet();
  return (
    <Button
      {...props}
      onClick={(...args) => {
        if (!wallet?.address) {
          connectWallet();
          return;
        }
        props.onClick?.(...args);
      }}
    />
  );
};
