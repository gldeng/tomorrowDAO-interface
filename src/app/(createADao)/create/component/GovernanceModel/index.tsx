'use client';

import { Button } from 'aelf-design';
import { Form, Radio } from 'antd';
import { memo } from 'react';
import { GovernanceModelType } from './type';
import GovernanceSchemeForm from './GovernanceSchemeForm';
import './index.css';

const GovernanceModel = () => {
  const [form] = Form.useForm();
  const governanceModelType = Form.useWatch('governanceModelType', form);
  console.log('governanceModelType', governanceModelType);
  return (
    <div className="governance-form">
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          name="governanceModelType"
          className="governanceModel-form-item"
          label={<span className="governance-title-primary">Governance Model</span>}
          initialValue={GovernanceModelType.Flexible}
        >
          <Radio.Group>
            <Radio value={GovernanceModelType.Fixed} className="governance-ratio-item">
              <span className="governance-type-text">
                Fixed governance mechanism: all proposals use the same voting mode
              </span>
            </Radio>
            <Radio value={GovernanceModelType.Flexible} className="governance-ratio-item">
              <span className="governance-type-text">
                Flexible governance mechanism: different proposals use different voting models
              </span>
            </Radio>
          </Radio.Group>
        </Form.Item>
        {governanceModelType === GovernanceModelType.Fixed && <GovernanceSchemeForm />}
      </Form>
      <Button
        onClick={() => {
          console.log(form.getFieldsValue());
        }}
      >
        get
      </Button>
    </div>
  );
};

export default memo(GovernanceModel);
