'use client';

import { Input, Tooltip } from 'aelf-design';
import { Form, InputNumber } from 'antd';
import { memo } from 'react';
import './index.css';
import InputSlideBind from 'components/InputSlideBind';
import { createPercentageRule, min2maxIntegerRule } from '../utils';

const HighCouncil = () => {
  const [form] = Form.useForm();
  return (
    <div className="governance-form">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}
        scrollToFirstError={true}
      >
        <div>
          <h2 className="form-title-primary cursor-pointer">High Council</h2>
          <p className="font-normal text-neutralPrimaryText text-[16px] leading-[24px] mb-[48px]">
            High Council is a collection of top-ranked addresses who staked and are voted by
            govemance tokens in a specific smart contract with primary governance responsibilities
            for the DAO. Its members may have certain governance or sensitive permissions.
          </p>
        </div>

        <Form.Item
          initialValue={'xxxxxxxxxxxxxxxx'}
          label={
            <Tooltip title="After initially staking a certain amount of tokens in the Election contract, you will be able to receive votes from other addresses. Stakers with a higher number of votes will become members of the High Council.">
              <span className="form-item-label">Election contract</span>
            </Tooltip>
          }
          extra="If no address completes a stake in this contract, the DAO creator will automatically become a HC member; adjustments can be made after the DAO is created."
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name={['high_council_config', 'max_high_council_member_count']}
          label={<span className="form-item-label">High Council Members</span>}
          extra="Alternate member of the High Council. The number can be changed through proposals."
          rules={[
            {
              required: true,
              type: 'integer',
              min: 1,
              max: 10000,
              message: 'Supports up to 10000 High Council members',
            },
          ]}
        >
          <InputNumber placeholder="At least 7 members required" controls={false} />
        </Form.Item>
        <Form.Item
          name={['high_council_config', 'max_high_council_candidate_count']}
          label={<span className="form-item-label">High Council Condidate Members</span>}
          extra="The number can be changed through proposals."
          rules={[
            {
              required: true,
              type: 'integer',
              min: 1,
              max: 10000,
              message: 'Supports up to 10000 High Council candidates.',
            },
          ]}
        >
          <InputNumber placeholder="At most 10000 members" controls={false} />
        </Form.Item>
        <Form.Item
          name={['high_council_config', 'election_period']}
          label={
            <Tooltip title="The number of days for the rotation of High Council members, counted from the day after the DAO is created. If zero is entered, it means there is no rotation for High Council members.">
              <span className="form-item-label">High Council member term length</span>
            </Tooltip>
          }
          rules={[
            {
              required: true,
              type: 'integer',
              min: 0,
              max: Number.MAX_SAFE_INTEGER,
              message: 'Please input a integer number >= 0',
            },
          ]}
        >
          <InputNumber
            placeholder="Days that High Council members can serve in each round"
            controls={false}
            addonAfter="Days"
          />
        </Form.Item>
        {/* governance_scheme_threshold */}
        <Form.Item
          name={['governance_scheme_threshold', 'minimal_required_threshold']}
          label={<span className="form-item-label">Minimum voting proportion</span>}
          initialValue={75}
          rules={[
            createPercentageRule(
              75,
              100,
              'Please input a integer number larger than 75 and smaller than 100',
            ),
          ]}
        >
          <InputSlideBind type="approve" placeholder={'Suggest setting it above 50%'} />
        </Form.Item>

        <Form.Item
          name={'minimal_vote_threshold'}
          label={
            <Tooltip title="The minimum number of votes required to finalize a proposal. Only applicable to proposals with 1 token 1 vote proposals.">
              <span className="form-item-label">Minimum votes</span>
            </Tooltip>
          }
          rules={min2maxIntegerRule}
        >
          <InputNumber
            placeholder="Refer to the governance token circulation to give a reasonable value"
            controls={false}
          />
        </Form.Item>
        {/* approve rejection abstention */}

        <Form.Item
          name={['governance_scheme_threshold', 'minimal_approve_threshold']}
          label={<span className="form-item-label">Minimum percentage of approved votes </span>}
          initialValue={67}
          rules={[
            createPercentageRule(
              67,
              100,
              'Please input a integer number larger than 67 and smaller than 100',
            ),
          ]}
        >
          <InputSlideBind type="approve" placeholder={'Suggest setting it above 50%'} />
        </Form.Item>
        <Form.Item
          name={['governance_scheme_threshold', 'maximal_rejection_threshold']}
          label={<span className="form-item-label">Maximum percentage of rejected votes</span>}
          initialValue={20}
          rules={[
            createPercentageRule(
              0,
              20,
              'Please input a integer number larger than 0 and smaller than 20',
            ),
          ]}
        >
          <InputSlideBind type="rejection" placeholder={'Suggest setting it below 20%'} />
        </Form.Item>
        <Form.Item
          name={['minimal_approve_threshold', 'maximal_abstention_threshold']}
          label={<span className="form-item-label">Maximum percentage of abstain votes</span>}
          initialValue={20}
          rules={[
            createPercentageRule(
              0,
              20,
              'Please input a integer number larger than 0 and smaller than 20',
            ),
          ]}
        >
          <InputSlideBind type="abstention" placeholder={'Suggest setting it below 20%'} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(HighCouncil);
