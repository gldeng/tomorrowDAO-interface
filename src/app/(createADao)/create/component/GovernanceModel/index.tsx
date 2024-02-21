'use client';

import { Button, Radio } from 'aelf-design';
import { Form, Switch } from 'antd';
import { memo, useState } from 'react';
import { GovernanceModelType } from './type';
import GovernanceSchemeForm from './GovernanceSchemeForm';
import HighCouncilForm from './HighCouncilForm';
import './index.css';

const GovernanceModel = () => {
  const [form] = Form.useForm();
  const governanceModelType = Form.useWatch('governanceModelType', form);
  const [isCheck, setIsCheck] = useState(false);
  const onHighCouncilSwitch = (checked: boolean) => {
    setIsCheck(checked);
  };
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
          name="governanceModelType"
          className="governanceModel-form-item"
          label={<span className="governance-title-primary pb-[8px]">Governance Model</span>}
          initialValue={GovernanceModelType.Fixed}
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
        {governanceModelType === GovernanceModelType.Fixed && (
          <GovernanceSchemeForm form={form} keyPrefix="governance_scheme_input" />
        )}
        {/* highCounci toggle */}
        <div>
          <div className="h-[28px] flex items-center mb-[16px]">
            <Switch onChange={onHighCouncilSwitch} value={isCheck} />
            <span
              onClick={() => setIsCheck(!isCheck)}
              className="governance-title-primary cursor-pointer pl-[16px]"
            >
              High Council
            </span>
          </div>
          <p className="font-normal text-neutralPrimaryText text-[16px] leading-[24px] mb-[48px]">
            High Council is a collection of top-ranked addresses who staked and are voted by
            govemance tokens in a specific smart contract with primary governance responsibilities
            for the DAO. Its members may have certain governance or sensitive permissions.
          </p>
        </div>
        {/* highCounci form */}
        {isCheck && <HighCouncilForm form={form} keyPrefix="high_council_input" />}
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
