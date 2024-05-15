'use client';
import { memo } from 'react';
import { useParams } from 'next/navigation';
import DeployForm from './DeployForm';
import useIsNetworkDao from 'hooks/useIsNetworkDao';
import './index.css';
const ProposalDeploy = () => {
  const { isNetWorkDao, networkDaoId } = useIsNetworkDao();
  const { daoId } = useParams<{ daoId: string; networkDaoId: string }>();
  return (
    <div className="deploy-form">
      <DeployForm daoId={isNetWorkDao ? networkDaoId : daoId} />
    </div>
  );
};

export default memo(ProposalDeploy);
