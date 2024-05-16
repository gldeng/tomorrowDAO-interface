'use client';
import { memo } from 'react';
import { useWebLogin } from 'aelf-web-login';
import { Result } from 'antd';
import { useParams } from 'next/navigation';
import DeployForm from './DeployForm';
import useIsNetworkDao from 'hooks/useIsNetworkDao';
import './index.css';
import { WebLoginState } from 'aelf-web-login';
const ProposalDeploy = () => {
  const { isNetWorkDao, networkDaoId } = useIsNetworkDao();
  const { loginState } = useWebLogin();
  const isLogin = loginState === WebLoginState.logined;
  const { daoId } = useParams<{ daoId: string; networkDaoId: string }>();
  return isLogin ? (
    <div className="deploy-form">
      <DeployForm daoId={isNetWorkDao ? networkDaoId : daoId} />
    </div>
  ) : (
    <Result
      className="px-4 lg:px-8"
      status="warning"
      title="Please Login first before creating a DAO"
    />
  );
};

export default memo(ProposalDeploy);
