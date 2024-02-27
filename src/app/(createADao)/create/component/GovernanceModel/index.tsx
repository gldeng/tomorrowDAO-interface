'use client';

import { Button, ToolTip } from 'aelf-design';
import { Form, InputNumber } from 'antd';
import { memo } from 'react';
import InputSlideBind from 'components/InputSlideBind';
import { createPercentageRule, min2maxIntegerRule } from '../utils';
import './index.css';

const GovernanceModel = () => {
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
        <Form.Item
          name={'minimal_required_threshold'}
          label={
            <ToolTip title="The minimum number of addresses required to participate in the voting of proposals.">
              <span className="form-item-label">Minimum voting addresses</span>
            </ToolTip>
          }
          rules={[
            {
              required: true,
              type: 'integer',
              min: 1,
              max: 99999999999,
              message:
                'Please input a integer number not smaller than 1 and not larger than 100,000,000,000',
            },
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
          rules={[
            createPercentageRule(
              1,
              100,
              'Please input a integer number larger than 0 and smaller than 100',
            ),
          ]}
        >
          <InputSlideBind type="approve" placeholder={'Suggest setting it above 50%'} />
        </Form.Item>
        <Form.Item
          name={'maximal_rejection_threshold'}
          label={<span className="form-item-label">Maximum percentage of rejected votes</span>}
          initialValue={20}
          rules={[createPercentageRule(0, 20, 'Please input a integer number smaller than 20')]}
        >
          <InputSlideBind type="rejection" placeholder={'Suggest setting it below 20%'} />
        </Form.Item>
        <Form.Item
          name={'maximal_abstention_threshold'}
          label={<span className="form-item-label">Maximum percentage of abstain votes</span>}
          initialValue={20}
          rules={[createPercentageRule(0, 20, 'Please input a integer number smaller than 20')]}
        >
          <InputSlideBind type="abstention" placeholder={'Suggest setting it below 20%'} />
        </Form.Item>
      </Form>
      <Button
        onClick={() => {
          form.validateFields().then((res) => {
            console.log('res', res);
          });
        }}
      >
        validate and then get form value
      </Button>
    </div>
  );
};

export default memo(GovernanceModel);
