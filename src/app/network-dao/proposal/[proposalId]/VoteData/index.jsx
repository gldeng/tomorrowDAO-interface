/**
 * @file vote data
 * @author atom-yang
 */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "aelf-design";
import { Row, Col, div } from "antd";
import VoteChart from "../../../_proposal_root/components/VoteChart";
import constants, {
  organizationInfoPropTypes,
} from "@redux/common/constants";

const { proposalStatus, proposalTypes } = constants;

const VoteData = (props) => {
  const {
    proposalType,
    status,
    approvals,
    rejections,
    abstentions,
    canVote,
    votedStatus,
    bpCount,
    handleApprove,
    handleReject,
    handleAbstain,
    expiredTime,
    organization,
  } = props;
  const [canThisUserVote, setCanThisVote] = useState(false);
  useEffect(() => {
    console.log(status, votedStatus, canVote);
    setCanThisVote(
      (status === proposalStatus.PENDING ||
        status === proposalStatus.APPROVED) &&
        votedStatus === "none" &&
        canVote
    );
  }, [status, votedStatus, expiredTime, canVote]);
  return (
    <div className='vote-data'>
      <Row type='flex'>
        <Col span={24}>
          <VoteChart
            proposalType={proposalType}
            approvals={approvals}
            rejections={rejections}
            abstentions={abstentions}
            bpCount={bpCount}
            organizationInfo={organization}
          />
        </Col>
        <Col
          span={24}
          className='vote-data-button'
        >
          <div className="vote-data-button-content">
            <Button
              type='primary'
              disabled={!canThisUserVote}
              className='approve-color gap-right'
              onClick={handleApprove}
              size='meduim'
            >
              Approve
            </Button>
            <Button
              className='gap-right-large'
              danger
              disabled={!canThisUserVote}
              onClick={handleReject}
              size='meduim'
            >
              &nbsp;Reject&nbsp;&nbsp;
            </Button>
            <Button
              type='link'
              disabled={!canThisUserVote}
              onClick={handleAbstain}
              size='meduim'
            >
              Abstain
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

VoteData.propTypes = {
  proposalType: PropTypes.oneOf(Object.values(proposalTypes)).isRequired,
  expiredTime: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(proposalStatus)).isRequired,
  approvals: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  rejections: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  abstentions: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  canVote: PropTypes.bool.isRequired,
  votedStatus: PropTypes.oneOf(["none", "Approve", "Reject", "Abstain"])
    .isRequired,
  bpCount: PropTypes.number.isRequired,
  handleApprove: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
  handleAbstain: PropTypes.func.isRequired,
  organization: PropTypes.shape(organizationInfoPropTypes).isRequired,
};

export default VoteData;
