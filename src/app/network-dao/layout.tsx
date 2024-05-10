'use client';
import React, { useEffect } from 'react';
import { Provider } from "react-redux";
import { useDispatch } from 'react-redux';
import { useSelector } from 'redux/store';
import {
  useWebLoginEvent,
  useWebLogin,
  WebLoginState,
  useLoginState,
  WebLoginEvents,
  ERR_CODE,
} from 'aelf-web-login';
import { WebLoginInstance } from "@utils/webLogin";
import { LOG_OUT_ACTIONS, LOG_IN_ACTIONS } from 'app/network-dao/_src/redux/actions/proposalCommon';
import store from "./_src/redux/store";
import dynamic from 'next/dynamic';

const Layout = dynamic(
  async () => {
    return (props: React.PropsWithChildren<{}>) => {
      const dispatch = useDispatch();
      const webLoginContext = useWebLogin();
      const { wallet, loginError, eventEmitter, loginState } = webLoginContext;
      const currentWallet = useSelector((state) => {
        return state.common.currentWallet;
      });
      WebLoginInstance.get().setWebLoginContext(webLoginContext);
      useEffect(() => {
        if (loginState === WebLoginState.initial && currentWallet.address) {
          dispatch({
            type: LOG_OUT_ACTIONS.LOG_OUT_SUCCESS,
          });
        } else if (loginState === WebLoginState.initial && loginError) {
          dispatch({
            type: LOG_IN_ACTIONS.LOG_IN_FAILED,
          });
        } else if (loginState === WebLoginState.logining) {
          dispatch({
            type: LOG_IN_ACTIONS.LOG_IN_START,
          });
        } else if (loginState === WebLoginState.logined) {
          dispatch({
            type: LOG_IN_ACTIONS.LOG_IN_SUCCESS,
            payload: wallet,
          });
        }
      }, [loginState])
      return (
        <div>
            {props.children}
          </div>
      );
    };
  },
  { ssr: false },
);
export default Layout;
