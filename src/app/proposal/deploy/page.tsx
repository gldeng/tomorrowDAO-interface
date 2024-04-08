import { memo } from 'react';
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
