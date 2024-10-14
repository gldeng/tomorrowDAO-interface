'use client';
import { memo, useEffect } from 'react';
import { Result } from 'antd';
import { useParams } from 'next/navigation';
import DeployForm from './DeployForm';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

import breadCrumb from 'utils/breadCrumb';
import './index.css';

const ProposalDeploy = () => {
  const { isConnected } = useConnectWallet();
  const { aliasName } = useParams<{ aliasName: string }>();
  useEffect(() => {
    breadCrumb.updateCreateProposalPage(aliasName);
  }, [aliasName]);
  return isConnected ? (
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
