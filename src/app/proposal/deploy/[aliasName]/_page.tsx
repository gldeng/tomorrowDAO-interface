'use client';
import { memo, useEffect } from 'react';
import { useWebLogin } from 'aelf-web-login';
import { Result } from 'antd';
import { useParams } from 'next/navigation';
import DeployForm from './DeployForm';
import './index.css';
import { WebLoginState } from 'aelf-web-login';
import breadCrumb from 'utils/breadCrumb';
const ProposalDeploy = () => {
  const { loginState } = useWebLogin();
  const isLogin = loginState === WebLoginState.logined;
  const { aliasName } = useParams<{ aliasName: string }>();
  useEffect(() => {
    breadCrumb.updateCreateProposalPage(aliasName);
  }, [aliasName]);
  return isLogin ? (
    <div className="deploy-form">
      <DeployForm aliasName={aliasName} />
    </div>
  ) : (
    <Result
      className="px-4 lg:px-8"
      status="warning"
      title="Please log in before creating a proposal"
    />
  );
};

export default memo(ProposalDeploy);
