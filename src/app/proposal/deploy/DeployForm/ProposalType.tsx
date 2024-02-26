'use client';

import { Radio } from 'aelf-design';
import { Button, Form, Switch, Select } from 'antd';
import { memo, useState } from 'react';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import { proposalTypeList } from '../util';

const defaultType = proposalTypeList[0].value;
console.log('defaultType', defaultType, proposalTypeList);

const { Option } = Select;
interface ProposalTypeProps {
  next?: () => void;
  className?: string;
}
const ProposalType = (props: ProposalTypeProps) => {
  const { next, className } = props;
  return (
    <div className={className}>
      <h2 className="title-primary">Choose Proposal Type</h2>
      <p className=" text-[16px] leading-[24px] text-Neutral-Secondary-Text font-normal mt-[8px] mb-[64px]">
        When creating a proposal, please choose the appropriate type based on its purpose and
        impact.
      </p>
      <Form.Item
        name={'proposal_type'}
        label={null}
        rules={[{ required: true, message: 'Please select proposal type' }]}
        initialValue={defaultType}
      >
        <ResponsiveSelect
          popupClassName="proposal-model-select"
          drawerProps={{
            title: 'Proposal Type',
          }}
          options={proposalTypeList}
          optionLabelProp="label"
          optionRender={(option) => (
            <div className="h-[48px]">
              <h2 className="text-[14px] leading-[22px] font-normal">{option.data.label}</h2>
              <p className="text-[14px] mt-[4px] leading-[22px] font-normal text-[#B8B8B8]">
                {option.data.desc}
              </p>
            </div>
          )}
        ></ResponsiveSelect>
      </Form.Item>
      <div className="flex justify-end mt-[100px]">
        <Button type="primary" className="w-[156px]" onClick={next}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default memo(ProposalType);
