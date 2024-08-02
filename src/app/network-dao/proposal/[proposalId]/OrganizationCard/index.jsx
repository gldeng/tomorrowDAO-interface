/**
 * @file desc list
 * @author atom-yang
 */
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Card, Row, Col } from "antd";
import {
  getOrganizationLeftInfo,
  getCircleValues,
} from "../../../organization/Organization/index";
import constants, {
  organizationInfoPropTypes,
} from "@redux/common/constants";
import addressFormat from "@utils/addressFormat";

const { proposalActions } = constants;

const OrganizationCard = (props) => {
  const {
    proposalType,
    bpCount,
    releaseThreshold,
    leftOrgInfo,
    orgAddress,
    bpList,
    parliamentProposerList,
    className,
  } = props;
  const thresholdValue = useMemo(
    () =>
      getCircleValues(
        proposalType,
        releaseThreshold,
        leftOrgInfo,
        bpCount || bpList.length
      ),
    [proposalType, releaseThreshold, leftOrgInfo, bpList]
  );
  const leftInfo = useMemo(
    () =>
      getOrganizationLeftInfo(
        proposalType,
        leftOrgInfo,
        bpList,
        parliamentProposerList
      ),
    [proposalType, leftOrgInfo, bpList, parliamentProposerList]
  );
  return (
    <div className={className} title="Organisation Info">
      <h3 className="pb-[24px] title">Organization Info</h3>
      <div className="gap-bottom-large">
        <span className="network-dao-lable-key">Address:</span>
        <span className="network-dao-lable-value break-all">{addressFormat(orgAddress)}</span>
      </div>
      <Row>
        <Col span={24} className="threshold-values">
          <>
            <div
              className=" text-ellipsis threshold-values-item"
              title={`${thresholdValue[proposalActions.APPROVE].num}(${
                thresholdValue[proposalActions.APPROVE].rate
              })`}
            >
              <span className="network-dao-lable-key">
                Minimal Approval Threshold:
              </span>
              <span className="network-dao-lable-value text-ell">
                {thresholdValue[proposalActions.APPROVE].num}(
                {thresholdValue[proposalActions.APPROVE].rate})
              </span>
            </div>
            <div
              className=" text-ellipsis threshold-values-item"
              title={`${thresholdValue[proposalActions.REJECT].num}(${
                thresholdValue[proposalActions.REJECT].rate
              })`}
            >
              <span className="network-dao-lable-key">
                Maximal Rejection Threshold:
              </span>
              <span className="network-dao-lable-value">
                {thresholdValue[proposalActions.REJECT].num}(
                {thresholdValue[proposalActions.REJECT].rate})
              </span>
            </div>
            <div
              className=" text-ellipsis threshold-values-item"
              title={`${thresholdValue[proposalActions.ABSTAIN].num}(${
                thresholdValue[proposalActions.ABSTAIN].rate
              })`}
            >
              <span className="network-dao-lable-key">
                Maximal Abstention Threshold:
              </span>
              <span className="network-dao-lable-value">
                {thresholdValue[proposalActions.ABSTAIN].num}(
                {thresholdValue[proposalActions.ABSTAIN].rate})
              </span>
            </div>
            <div
              className=" text-ellipsis threshold-values-item"
              title={`${thresholdValue.Total.num}(${thresholdValue.Total.rate})`}
            >
              <span className="network-dao-lable-key">
                Minimal Vote Threshold:
              </span>
              <span className="network-dao-lable-value">
                {thresholdValue.Total.num}({thresholdValue.Total.rate})
              </span>
            </div>
          </>
        </Col>
        <Col span={24} className="org-info">
          {leftInfo}
        </Col>
      </Row>
    </div>
  );
};

OrganizationCard.propTypes = {
  ...organizationInfoPropTypes,
  bpList: PropTypes.arrayOf(PropTypes.string).isRequired,
  parliamentProposerList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default OrganizationCard;
