'use client';

import { Radio } from 'aelf-design';
import { Button, Form, Switch, Select } from 'antd';
import { memo, useState } from 'react';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import { proposalTypeList } from '../type';

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
        initialValue={proposalTypeList[0].value}
      >
        <ResponsiveSelect
          popupClassName="proposal-type-select"
          drawerProps={{
            title: 'Proposal Type',
            className: 'proposal-type-draw',
          }}
          options={proposalTypeList}
          optionLabelProp="label"
          optionRender={(option) => (
            <ProposalTypeItem label={option.data.label} desc={option.data.desc} />
          )}
        ></ResponsiveSelect>
      </Form.Item>
      <div className="flex justify-end mt-[494px]">
        <Button type="primary" className="w-[156px]" onClick={next}>
          Continue
        </Button>
      </div>
    </div>
  );
};
function ProposalTypeItem(props: { label: string; desc: string }) {
  const { label, desc } = props;
  return (
    <div>
      <h2 className="text-[16px] leading-[24px] font-normal label-text">{label}</h2>
      <p className="text-[14px] mt-[4px] leading-[22px] font-normal text-Neutral-Disable-Text text-wrap">
        {desc}
      </p>
    </div>
  );
}
export default memo(ProposalType);
