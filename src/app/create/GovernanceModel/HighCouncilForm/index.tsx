'use client';

import { Form, Input } from 'antd';
import { memo } from 'react';
const HighCouncilForm = () => {
  return (
    <>
      <Form.Item
        name="governance_scheme_id"
        label={<span className="governance-title-secondary">Select a governance model</span>}
        rules={[{ required: true, message: 'Please select your country!' }]}
      >
        <Input />
      </Form.Item>
    </>
  );
};

export default memo(HighCouncilForm);
