'use client';

import { Button } from 'aelf-design';
import { Form, Input, Radio, Select } from 'antd';
import { memo } from 'react';

const governanceMechanismList = [
  {
    governanceSchemeId: 'governanceSchemeId1',
    name: 'Referendum',
  },
  {
    governanceSchemeId: 'governanceSchemeId2',
    name: 'Association',
  },
  {
    governanceSchemeId: 'governanceSchemeId3',
    name: 'Referendum',
  },
  {
    governanceSchemeId: 'governanceSchemeId4',
    name: 'Customed',
  },
];
const { Option } = Select;
const GovernanceSchemeForm = () => {
  return (
    <>
      <Form.Item
        name="governance_scheme_id"
        label={<span className="governance-title-secondary">Select a governance model</span>}
        rules={[{ required: true, message: 'Please select your country!' }]}
      >
        <Select placeholder="Please select a country">
          {governanceMechanismList.map((item) => {
            return (
              <Option key={item.governanceSchemeId} value={item.governanceSchemeId}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </>
  );
};

export default memo(GovernanceSchemeForm);
