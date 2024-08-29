/**
 * @file proposal item
 * @author atom-yang
 */
// eslint-disable-next-line no-use-before-define
import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import Link from 'next/link';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Tag, Divider } from "antd";
import getChainIdQuery from 'utils/url';
import constants, {
  LOG_STATUS,
  ACTIONS_COLOR_MAP,
  organizationInfoPropTypes,
  STATUS_COLOR_MAP,
  CONTRACT_TEXT_MAP,
  PROPOSAL_STATUS_CAPITAL,
} from "@redux/common/constants";
import LinkNetworkDao from 'components/LinkNetworkDao';
import "./index.css";
import VoteChart from "../../_proposal_root/components/VoteChart";
import { PRIMARY_COLOR } from "@common/constants";
import addressFormat from "@utils/addressFormat";
import { NETWORK_TYPE } from "@config/config";
import { getBPCount } from "@common/utils";
import ButtonWithLoginCheck from "@components/ButtonWithLoginCheck";
import { HashAddress } from "aelf-design";

const { proposalTypes, proposalStatus, proposalActions } = constants;

export const ACTIONS_ICON_MAP = {
  [proposalActions.APPROVE]: (
    <CheckCircleOutlined className="gap-right-small" />
  ),
  [proposalActions.REJECT]: <CloseCircleOutlined className="gap-right-small" />,
  [proposalActions.ABSTAIN]: (
    <MinusCircleOutlined className="gap-right-small" />
  ),
};
const chainIdQuery = getChainIdQuery();
const Title = (props) => {
  const { status, proposalType, votedStatus, expiredTime } = props;
  const momentExpired = moment(expiredTime);
  const now = moment();
  const threshold = moment().add(3, "days");
  const showExpired =
    status !== proposalStatus.RELEASED &&
    momentExpired.isAfter(now) &&
    momentExpired.isBefore(threshold);
  return (
    <div className="proposal-list-item-title">
      <span className="gap-right-small card-sm-text-bold-black">{proposalType}</span>
      {votedStatus !== "none" ? (
        <Tag color={ACTIONS_COLOR_MAP[votedStatus]}>
          {ACTIONS_ICON_MAP[votedStatus]}
          {votedStatus}
        </Tag>
      ) : null}
      {showExpired ? (
        <span className="warning-text">{`Expire ${now.to(
          momentExpired
        )}`}</span>
      ) : null}
    </div>
  );
};
Title.propTypes = {
  status: PropTypes.oneOf(Object.values(proposalStatus)).isRequired,
  proposalType: PropTypes.oneOf(Object.values(proposalTypes)).isRequired,
  votedStatus: PropTypes.oneOf(["none", "Approve", "Reject", "Abstain"])
    .isRequired,
  expiredTime: PropTypes.string.isRequired,
};

const Proposal = (props) => {
  const {
    proposalType,
    proposalId,
    expiredTime,
    releasedTime,
    contractAddress,
    contractMethod,
    proposer,
    organizationInfo,
    status,
    loading,
    approvals,
    rejections,
    abstentions,
    canVote,
    votedStatus,
    bpCount,
    currentAccount,
    logStatus,
    handleRelease,
    handleApprove,
    handleReject,
    handleAbstain,
    title,
    description,
  } = props;

  const bpCountNumber =
    NETWORK_TYPE === "MAIN"
      ? getBPCount(status, expiredTime, releasedTime)
      : bpCount;
  const canThisUserVote =
    (status === proposalStatus.PENDING || status === proposalStatus.APPROVED) &&
    votedStatus === "none" &&
    canVote;
  const canRelease =
    logStatus === LOG_STATUS.LOGGED &&
    currentAccount &&
    proposer === currentAccount;
  return (
    <div className="proposal-list-item gap-bottom">
      <Card
        title={
          <Title
            status={status}
            expiredTime={expiredTime}
            proposalType={proposalType}
            votedStatus={votedStatus}
          />
        }
      >
        <div className="proposal-list-item-id">
          <div className="id-wrap gap-right-large flex flex-col justify-center">
            <h2 className="truncate card-xsm-text-bold-black">{title}</h2>
            <LinkNetworkDao
                className="text-ellipsis card-xsm-text-bold"
                href={{
                  pathname: `/proposal/${proposalId}`,
                }}            
              >
                {proposalId}
              </LinkNetworkDao>
              {CONTRACT_TEXT_MAP[contractMethod] ? (
                <Tag color={PRIMARY_COLOR} className="max-content">
                  {CONTRACT_TEXT_MAP[contractMethod]}
                </Tag>
              ) : null}
          </div>
          <div className="proposal-list-item-id-status flex flex-col justify-center lg:items-center">
            <Tag color={STATUS_COLOR_MAP[status]}  className="max-content">
              {PROPOSAL_STATUS_CAPITAL[status]}
            </Tag>
            {status === proposalStatus.APPROVED && canRelease ? (
              // eslint-disable-next-line max-len
              <Button
                proposal-id={proposalId}
                type="link"
                size="small"
                onClick={handleRelease}
                loading={loading.Release[proposalId]}
              >
                Release&gt;
              </Button>
            ) : null}
          </div>
        </div>
        <Divider className="my-[16px]"/>
        <div className="proposal-list-item-info">
          <div className="proposal-list-item-info-item">
            <span className="info-key">Proposal Expires:</span>
            <span className="info-value text-ellipsis">
              {moment(expiredTime).format("YYYY/MM/DD HH:mm:ss")}
            </span>
          </div>
          <div className="proposal-list-item-info-item">
            <span className="info-key">Contract:</span>
            <div className="info-value text-ellipsis">
              <HashAddress address={contractAddress} 
              preLen={16}
              endLen={16}
              chain={chainIdQuery.chainId}
              />
            </div>
          </div>
          <div className="proposal-list-item-info-item">
            <span className="info-key">Contract Method:</span>
            <span className="info-value text-ellipsis">{contractMethod}</span>
          </div>
        </div>
        <Divider className="my-[16px]"/>
        <VoteChart
          proposalType={proposalType}
          approvals={approvals}
          rejections={rejections}
          abstentions={abstentions}
          bpCount={bpCountNumber}
          organizationInfo={organizationInfo}
        />
        <Divider className="my-[16px]"/>
        <div className="proposal-list-item-actions">
          <ButtonWithLoginCheck
            type='primary'
            disabled={!canThisUserVote}
            className="approve-color approve-button"
            size='meduim'
            proposal-id={proposalId}
            onClick={handleApprove}
            loading={loading.Approve[proposalId] && canThisUserVote}
          >
            Approve
          </ButtonWithLoginCheck>
          <ButtonWithLoginCheck
            danger
            type='primary'
            size='meduim'
            className="reject-button"
            disabled={!canThisUserVote}
            proposal-id={proposalId}
            onClick={handleReject}
            loading={loading.Reject[proposalId] && canThisUserVote}
          >
            &nbsp;Reject&nbsp;
          </ButtonWithLoginCheck>
          <ButtonWithLoginCheck
            className="proposal-list-item-abstain abstention-button"
            type='primary'
            size='meduim'
            disabled={!canThisUserVote}
            onClick={handleAbstain}
            proposal-id={proposalId}
            loading={loading.Abstain[proposalId] && canThisUserVote}
          >
            Abstain
          </ButtonWithLoginCheck>
        </div>
      </Card>
    </div>
  );
};

/* eslint-disable react/no-unused-prop-types */
export const proposalPropTypes = {
  proposalType: PropTypes.oneOf(Object.values(proposalTypes)).isRequired,
  proposalId: PropTypes.string.isRequired,
  expiredTime: PropTypes.string.isRequired,
  createTxId: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired,
  contractMethod: PropTypes.string.isRequired,
  proposer: PropTypes.string.isRequired,
  organizationInfo: PropTypes.shape(organizationInfoPropTypes).isRequired,
  isContractDeployed: PropTypes.bool.isRequired,
  createdBy: PropTypes.oneOf(["USER", "SYSTEM_CONTRACT"]).isRequired,
  releasedTxId: PropTypes.string.isRequired,
  releasedTime: PropTypes.string.isRequired,
  createAt: PropTypes.string.isRequired,
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
  logStatus: PropTypes.oneOf(Object.values(LOG_STATUS)).isRequired,
  bpCount: PropTypes.number.isRequired,
  handleRelease: PropTypes.func.isRequired,
  handleApprove: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
  handleAbstain: PropTypes.func.isRequired,
  currentAccount: PropTypes.string,
};

Proposal.propTypes = proposalPropTypes;
Proposal.defaultProps = {
  currentAccount: "",
};

export default Proposal;
