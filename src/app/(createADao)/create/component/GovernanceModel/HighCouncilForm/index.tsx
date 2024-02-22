'use client';

import { Form, FormInstance, Input, InputNumber } from 'antd';
import { Tooltip, Radio } from 'aelf-design';
import { memo } from 'react';

interface HighCouncilFormProps {
  form: FormInstance;
  keyPrefix: string;
}

const HighCouncilForm = (props: HighCouncilFormProps) => {
  const { keyPrefix } = props;
  return (
    <>
      <Form.Item
        name={[keyPrefix, 'is_require_high_council_for_execution']}
        label={
          <span className="form-item-label">Only High Council members can execute proposals</span>
        }
        initialValue={true}
      >
        <Radio.Group>
          <Radio value={true}>Yes</Radio>
          <Radio value={false}>No</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name={[keyPrefix, 'high_council_config', 'max_high_council_member_count']}
        label={<span className="form-item-label">High Council Members</span>}
        extra="Alternate member of the High Council. The number can be changed through proposals."
        rules={[
          {
            required: true,
            type: 'integer',
            min: 7,
            max: 10000,
            message: 'Supports up to 10000 High Council members',
          },
        ]}
      >
        <InputNumber placeholder="At least 7 members required" controls={false} />
      </Form.Item>
      <Form.Item
        name={[keyPrefix, 'high_council_config', 'max_high_council_candidate_count']}
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
        name={[keyPrefix, 'high_council_config', 'election_period']}
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
      <Form.Item
        name={'__private_contract_address'}
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
    </>
  );
};

export default memo(HighCouncilForm);
