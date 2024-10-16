'use client';
import { memo, useEffect, useState } from 'react';
import { Result } from 'antd';
import {} from 'ahooks';
import { useParams } from 'next/navigation';
import Form from './Form';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import useMount from 'hooks/useMount';
import breadCrumb from 'utils/breadCrumb';
import '../proposal-create/index.css';

const ProposalDeploy = () => {
  const { walletInfo } = useConnectWallet();
  const { aliasName } = useParams<{ aliasName: string }>();
  useEffect(() => {
    breadCrumb.updateCreateProposalPage(aliasName);
  }, [aliasName]);
  return (
    <div>
      <div className="deploy-form">
        {walletInfo ? (
          <Form />
        ) : (
          <Result
            className="px-4 lg:px-8"
            status="warning"
            title="Please log in before creating a proposal"
          />
        )}
      </div>
    </div>
  );
};

export default memo(ProposalDeploy);
