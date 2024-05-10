'use client';
import { memo } from 'react';
import DeployForm from './DeployForm';
import './index.css';
import { useParams } from 'next/navigation';
const ProposalDeploy = () => {
  const { daoId } = useParams<{ daoId: string }>();
  return (
    <div className="deploy-form">
      <DeployForm daoId={daoId} />
    </div>
  );
};

export default memo(ProposalDeploy);
