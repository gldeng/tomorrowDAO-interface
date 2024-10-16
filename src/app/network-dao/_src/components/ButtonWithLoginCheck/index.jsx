import React from "react";
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { Button } from "antd";
import { showAccountInfoSyncingModal } from "../SimpleModal/index.tsx";

export default function ButtonWithLoginCheck({
  children,
  onClick,
  checkAccountInfoSync,
  ...props
}) {
  // const { loginState, login, wallet } = useWebLogin();
  const { connectWallet, connecting, walletInfo } = useConnectWallet()

  // const onClickInternal = (event) => {
  //   if (
  //     loginState === WebLoginState.initial ||
  //     loginState === WebLoginState.eagerly ||
  //     loginState === WebLoginState.lock
  //   ) {
  //     login();
  //   } else if (loginState === WebLoginState.logined) {
  //     if (checkAccountInfoSync) {
  //       if (!wallet.accountInfoSync.syncCompleted) {
  //         showAccountInfoSyncingModal();
  //         return;
  //       }
  //     }
  //     onClick?.(event);
  //   }
  // };

  const onClickInternal = (event) => {
    if (!walletInfo) {
      connectWallet();
    } else {
      onClick?.(event);
    }
  };

  return (
    <Button
      {...props}
      onClick={onClickInternal}
      loading={ connecting || props.loading }
    >
      {children}
    </Button>
  );
}