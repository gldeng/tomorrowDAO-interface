import { memo } from 'react';
import DeployForm from './DeployForm';
import './index.css';
const ProposalDeploy = (props: { params: { daoId: string } }) => {
  const { daoId } = props.params;
  return (
    <div className="deploy-form">
      <DeployForm daoId={daoId} />
    </div>
  );
};

export default memo(ProposalDeploy);
