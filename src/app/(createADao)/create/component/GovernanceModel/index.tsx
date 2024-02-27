'use client';

import { Button, ToolTip } from 'aelf-design';
import { Form, InputNumber } from 'antd';
import { memo, useContext, useEffect } from 'react';
import InputSlideBind from 'components/InputSlideBind';
import { integerRule, min2maxIntegerRule, useRegisterForm, validatorCreate } from '../utils';
import './index.css';
import { StepEnum, StepsContext } from '../../type';
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
          name={'minimal_required_threshold'}
          label={
            <ToolTip title="The minimum number of addresses required to participate in the voting of proposals.">
              <span className="form-item-label">Minimum voting addresses</span>
            </ToolTip>
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
          <InputNumber placeholder="The number should ≥ 1" controls={false} />
        </Form.Item>

        <Form.Item
          name={'minimal_vote_threshold'}
          label={
            <ToolTip title="The minimum number of votes required to finalize a proposal. Only applicable to proposals with 1 token 1 vote proposals.">
              <span className="form-item-label">Minimum votes</span>
            </ToolTip>
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
          name={'minimal_approve_threshold'}
          label={<span className="form-item-label">Minimum percentage of approved votes </span>}
          initialValue={50}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v === 0, 'Please input a number larger than 0'),
            validatorCreate((v) => v > 100, 'Please input a number smaller than 100'),
          ]}
        >
          <InputSlideBind type="approve" placeholder={'Suggest setting it above 50%'} />
        </Form.Item>
        <Form.Item
          name={'maximal_rejection_threshold'}
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
          name={'maximal_abstention_threshold'}
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

export default memo(GovernanceModel);
