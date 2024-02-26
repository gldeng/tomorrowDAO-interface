'use client';

import { Radio, Input } from 'aelf-design';
import { Button, Form, Switch, Select } from 'antd';
import { memo, useState } from 'react';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import { voteSchemeIds, contractInfoList } from '../util';

const { Option } = Select;
interface ProposalInfoProps {
  next?: () => void;
  className?: string;
}
const ProposalInfo = (props: ProposalInfoProps) => {
  const { next, className } = props;
  return (
    <div className={className}>
      <h2 className="text-[20px] leading-[28px] font-weight">Proposal Details</h2>
      <p className=" text-[16px] leading-[24px] text-Neutral-Secondary-Text font-normal mt-[8px] mb-[64px]">
        Governance proposals ami to modify aelf chain's governance parameters. All contracts are
        system contracts which play criticla roles fo aelf ecosystem
      </p>
      <Form.Item
        name={'proposal_title'}
        label={<span className="form-item-label">Title</span>}
        rules={[
          {
            required: true,
            min: 0,
            max: 300,
            message: 'The proposal title supports a maximum of 300 characters',
          },
        ]}
      >
        <Input type="text" placeholder="Please input the title (300 words at most)" />
      </Form.Item>
      <Form.Item
        name={'proposal_description'}
        label={<span className="form-item-label">Description</span>}
        rules={[
          {
            required: true,
            min: 0,
            max: 300000,
            message: 'The proposal title supports a maximum of 300,000 characters',
          },
        ]}
      >
        {/* todo: MD  */}
        <Input type="text" placeholder="Please input the content" />
      </Form.Item>
      <h2 className="title-primary mt-[64px]">Governance Information</h2>
      {/* Discussion on forum */}
      {/* 2. Voters and executors: */}
      {/* vote model */}
      <Form.Item
        name={'vote_scheme_id'}
        label={<span className="form-item-label">Vote Model</span>}
        initialValue={voteSchemeIds[0].value}
      >
        <Radio.Group>
          {voteSchemeIds.map((item) => {
            return (
              <Radio value={item.value} key={item.value}>
                {item.label}
              </Radio>
            );
          })}
        </Radio.Group>
      </Form.Item>
      {/* contract address: */}
      <Form.Item
        name={['transaction', 'to_address']}
        label={null}
        rules={[{ required: true, message: 'Please select proposal type' }]}
      >
        <ResponsiveSelect
          popupClassName="proposal-model-select"
          drawerProps={{
            title: 'Proposal Type',
          }}
          options={contractInfoList.map((item) => {
            return {
              label: item.name,
              value: item.address,
            };
          })}
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

export default memo(ProposalInfo);
