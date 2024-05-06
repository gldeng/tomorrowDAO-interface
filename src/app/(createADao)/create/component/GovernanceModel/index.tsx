'use client';

import { Tooltip } from 'aelf-design';
import { Form, InputNumber } from 'antd';
import { InfoCircleOutlined } from '@aelf-design/icons';
import { memo } from 'react';
import InputSlideBind from 'components/InputSlideBind';
import {
  integerRule,
  min2maxIntegerRule,
  percentRule,
  useRegisterForm,
  validatorCreate,
} from '../utils';
import './index.css';
import { StepEnum } from '../../type';
const GovernanceModel = () => {
  const [form] = Form.useForm();
  useRegisterForm(form, StepEnum.step1);
  return (
    <div className="governance-form">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}
        scrollToFirstError={true}
      >
        <Form.Item
          name={'minimalRequiredThreshold'}
          label={
            <Tooltip title="The minimum number of voters (addresses) required to participate in voting on proposals, at least 1.">
              <span className="form-item-label">
                Minimum Voter Requirement
                <InfoCircleOutlined className="cursor-pointer label-icon" />
              </span>
            </Tooltip>
          }
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v < 1, 'Please input a number not smaller than 1'),
            validatorCreate(
              (v) => v >= 100000000000,
              'Please input a number  not larger than 100,000,000,000',
            ),
          ]}
        >
          <InputNumber placeholder="Enter 1 or more" controls={false} />
        </Form.Item>

        <Form.Item
          name={'minimalVoteThreshold'}
          label={
            <Tooltip
              title={
                <div>
                  <div>
                    The minimum number of votes required to finalise a proposal, only applicable to
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    the voting mechanism where "1 token = 1 vote".
                  </div>
                  <div>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Note: There are two types of voting mechanisms: "1 token = 1 vote" and "1
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    address = 1 vote". You can choose the voting mechanism when you create the
                    proposal.
                  </div>
                </div>
              }
            >
              <span className="form-item-label">
                Minimum Vote Requirement
                <InfoCircleOutlined className="cursor-pointer label-icon" />
              </span>
            </Tooltip>
          }
          validateFirst={true}
          rules={min2maxIntegerRule}
        >
          <InputNumber placeholder="Enter a reasonable value" controls={false} />
        </Form.Item>

        {/* approve rejection abstention */}
        <Form.Item
          name={'minimalApproveThreshold'}
          label={
            <Tooltip
              title={`The lowest percentage of approve votes required for a proposal to be approved. This is applicable to both voting mechanisms, where "1 token = 1 vote" or "1 address = 1 vote".`}
            >
              <span className="form-item-label">
                Minimum Approval Rate
                <InfoCircleOutlined className="cursor-pointer label-icon" />
              </span>
            </Tooltip>
          }
          initialValue={50}
          validateFirst={true}
          rules={percentRule}
        >
          <InputSlideBind
            type="approve"
            placeholder={'The suggested percentage is no less than 50%.'}
          />
        </Form.Item>
        <Form.Item
          name={'maximalRejectionThreshold'}
          label={
            <Tooltip
              title={`The percentage of reject votes at which a proposal would be rejected. This is applicable to both voting mechanisms, where "1 token = 1 vote" or "1 address = 1 vote".
            Note: If the rejection threshold and other thresholds are met simultaneously, the proposal will be rejected. `}
            >
              <span className="form-item-label">
                Maximum Rejection Rate
                <InfoCircleOutlined className="cursor-pointer label-icon" />
              </span>
            </Tooltip>
          }
          initialValue={20}
          validateFirst={true}
          rules={percentRule}
        >
          <InputSlideBind
            type="rejection"
            placeholder={'The suggested percentage is no greater than 20%.'}
          />
        </Form.Item>
        <Form.Item
          name={'maximalAbstentionThreshold'}
          label={
            <Tooltip
              title={`The percentage of abstain votes at which a proposal would be classified as abstained. This is applicable to both voting mechanisms, where "1 token = 1 vote" or "1 address = 1 vote".
            Note: If the abstain threshold and approval threshold are met simultaneously, the proposal will be classified as abstained. `}
            >
              <span className="form-item-label">
                Maximum Abstain Rate
                <InfoCircleOutlined className="cursor-pointer label-icon" />
              </span>
            </Tooltip>
          }
          initialValue={20}
          validateFirst={true}
          rules={percentRule}
        >
          <InputSlideBind
            type="abstention"
            placeholder={'The suggested percentage is no greater than 20%.'}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(GovernanceModel);
