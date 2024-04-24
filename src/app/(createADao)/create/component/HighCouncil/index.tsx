'use client';

import { Input, Tooltip } from 'aelf-design';
import { Form, InputNumber } from 'antd';
import { memo } from 'react';
import './index.css';
import InputSlideBind from 'components/InputSlideBind';
import { integerRule, min2maxIntegerRule, validatorCreate, useRegisterForm } from '../utils';
import { StepEnum } from '../../type';

const HighCouncil = () => {
  const [form] = Form.useForm();
  useRegisterForm(form, StepEnum.step2);
  return (
    <div className="high-council-form">
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
          label={
            <Tooltip title="After initially staking a certain amount of tokens in the Election contract, you will be able to receive votes from other addresses. Stakers with a higher number of votes will become members of the High Council.">
              <span className="form-item-label">Election contract</span>
            </Tooltip>
          }
          extra="If no address completes a stake in this contract, the DAO creator will automatically become a HC member; adjustments can be made after the DAO is created."
        >
          <Input disabled defaultValue={'xxxxxxxxxxx111112121212121abc'} />
        </Form.Item>

        <Form.Item
          name={['highCouncilConfig', 'maxHighCouncilMemberCount']}
          label={<span className="form-item-label">High Council Members</span>}
          extra="Alternate member of the High Council. The number can be changed through proposals."
          validateFirst={true}
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
          name={['highCouncilConfig', 'maxHighCouncilCandidateCount']}
          label={<span className="form-item-label">High Council Condidate Members</span>}
          extra="The number can be changed through proposals."
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v < 1, 'Please input a number larger than 1'),
            validatorCreate((v) => v > 10000, 'Supports up to 10000 High Council members'),
          ]}
        >
          <InputNumber placeholder="At most 10000 members" controls={false} />
        </Form.Item>
        <Form.Item
          name={['highCouncilConfig', 'electionPeriod']}
          label={
            <Tooltip title="The number of days for the rotation of High Council members, counted from the day after the DAO is created. If zero is entered, it means there is no rotation for High Council members.">
              <span className="form-item-label">High Council member term length</span>
            </Tooltip>
          }
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate(
              (v) => v > Number.MAX_SAFE_INTEGER,
              `Please input a number not larger than ${Number.MAX_SAFE_INTEGER}`,
            ),
          ]}
        >
          <InputNumber
            placeholder="Days that High Council members can serve in each round"
            controls={false}
            suffix="Days"
          />
        </Form.Item>
        {/* governanceSchemeThreshold */}
        <Form.Item
          name={['governanceSchemeThreshold', 'minimalRequiredThreshold']}
          label={<span className="form-item-label">Minimum voting proportion</span>}
          initialValue={75}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v < 75, 'Please input a number larger than 75'),
            validatorCreate((v) => v > 100, 'Please input a number smaller than 100'),
          ]}
        >
          <InputSlideBind type="approve" placeholder={'Suggest setting it above 50%'} />
        </Form.Item>

        <Form.Item
          name={['governanceSchemeThreshold', 'minimalVoteThreshold']}
          label={
            <Tooltip title="The minimum number of votes required to finalize a proposal. Only applicable to proposals with 1 token 1 vote proposals.">
              <span className="form-item-label">Minimum votes</span>
            </Tooltip>
          }
          validateFirst={true}
          rules={min2maxIntegerRule}
        >
          <InputNumber
            placeholder="Refer to the governance token circulation to give a reasonable value"
            controls={false}
          />
        </Form.Item>
        {/* approve rejection abstention */}

        <Form.Item
          name={['governanceSchemeThreshold', 'minimalApproveThreshold']}
          label={<span className="form-item-label">Minimum percentage of approved votes </span>}
          initialValue={67}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v < 67, 'Please input a number larger than 67'),
            validatorCreate((v) => v > 100, 'Please input a number smaller than 100'),
          ]}
        >
          <InputSlideBind type="approve" placeholder={'Suggest setting it above 50%'} />
        </Form.Item>
        <Form.Item
          name={['governanceSchemeThreshold', 'maximalRejectionThreshold']}
          label={<span className="form-item-label">Maximum percentage of rejected votes</span>}
          initialValue={20}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v === 0, 'Please input a number larger than 0'),
            validatorCreate((v) => v > 20, 'Please input a number smaller than 20'),
          ]}
        >
          <InputSlideBind type="rejection" placeholder={'Suggest setting it below 20%'} />
        </Form.Item>
        <Form.Item
          name={['governanceSchemeThreshold', 'maximalAbstentionThreshold']}
          label={<span className="form-item-label">Maximum percentage of abstain votes</span>}
          initialValue={20}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v === 0, 'Please input a number larger than 0'),
            validatorCreate((v) => v > 20, 'Please input a number smaller than 20'),
          ]}
        >
          <InputSlideBind type="abstention" placeholder={'Suggest setting it below 20%'} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(HighCouncil);
