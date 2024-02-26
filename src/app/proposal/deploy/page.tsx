import { memo, useState } from 'react';
import { Steps } from 'antd';
import clsx from 'clsx';
import DeployForm from './DeployForm';
import './index.css';
const ProposalDeploy = () => {
  return (
    <div className="deploy-form">
      <DeployForm />
    </div>
  );
};

export default memo(ProposalDeploy);
