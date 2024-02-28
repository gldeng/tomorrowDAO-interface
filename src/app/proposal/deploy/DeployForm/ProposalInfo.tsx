'use client';

import { Radio, Input, ToolTip, Button } from 'aelf-design';
import { Form, Select } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import MarkdownEditor from 'components/MarkdownEditor';
import Editor from '@monaco-editor/react';
import { ReactComponent as ArrowIcon } from 'assets/imgs/arrow-icon.svg';
import {
  fetchGovernanceMechanismList,
  GovernanceMechanismList,
  fetchDaoInfo,
  DaoInfo,
  ContractInfo,
  fetchContractInfo,
  VoteSchemeListRes,
  fetchVoteSchemeList,
  proposalTypeList,
} from '../type';
import { formatDate } from '../util';

const { Option } = Select;
interface ProposalInfoProps {
  next?: () => void;
  className?: string;
}
const ProposalInfo = (props: ProposalInfoProps) => {
  const [governanceMechanismList, setGovernanceMechanismList] = useState<GovernanceMechanismList>();
  const [daoInfo, setDaoInfo] = useState<DaoInfo>();
  const [contractInfo, setContractInfo] = useState<ContractInfo>();
  const [voteScheme, setVoteScheme] = useState<VoteSchemeListRes>();
  const { next, className } = props;

  const governanceMechanismOptions = useMemo(() => {
    return governanceMechanismList?.governanceMechanismList.map((item) => {
      const isHighCouncil = item.name === 'High Council';
      let num = daoInfo?.memberCount ?? 0;
      if (!daoInfo?.governanceToken) {
        num = 0;
      }
      return {
        label: isHighCouncil ? `High Council (${num} members)` : item.name,
        disabled: num === 0,
        value: item.governanceSchemeId,
      };
    });
  }, [governanceMechanismList]);
  const contractInfoOptions = useMemo(() => {
    return contractInfo?.contractInfoList.map((item) => {
      return {
        label: item.ContractName,
        value: item.ContractAddress,
      };
    });
  }, [contractInfo]);
  const form = Form.useFormInstance();
  const contractAddress = Form.useWatch(['transaction', 'to_address'], form);
  const proposalType = Form.useWatch('proposal_type', form);
  const contractMethodOptions = useMemo(() => {
    const contract = contractInfo?.contractInfoList.find(
      (item) => item.ContractAddress === contractAddress,
    );
    return (
      contract?.FunctionList?.map((item) => {
        return {
          label: item,
          value: item,
        };
      }) ?? []
    );
  }, [contractInfo, contractAddress]);
  useEffect(() => {
    const run = async () => {
      const [governanceMechanismListRes, daoInfo, contractInfo, voteSchemeListRes] =
        await Promise.all([
          fetchGovernanceMechanismList({ chainId: 'aelf' }),
          fetchDaoInfo({ chainId: 'x', daoId: 'x' }),
          fetchContractInfo({ chainId: 'aelf' }),
          fetchVoteSchemeList({ chainId: 'aelf' }),
        ]);
      setGovernanceMechanismList(governanceMechanismListRes);
      setDaoInfo(daoInfo);
      setContractInfo(contractInfo);
      setVoteScheme(voteSchemeListRes);
    };
    run();
  }, []);
  const proposalDetailDesc = useMemo(() => {
    return proposalTypeList.find((item) => item.value === proposalType)?.detailDesc ?? '';
  }, [proposalType]);
  return (
    <div className={className}>
      <h2 className="text-[20px] leading-[28px] font-weight">Proposal Details</h2>
      <p className=" text-[16px] leading-[24px] text-Neutral-Secondary-Text font-normal mt-[8px] mb-[64px]">
        {proposalDetailDesc}
      </p>
      <Form.Item
        name={['proposal_basic_info', 'proposal_title']}
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
        name={['proposal_basic_info', 'proposal_description']}
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
        <MarkdownEditor />
      </Form.Item>

      {/* Discussion on forum */}
      <h2 className="title-primary mt-[64px]">Governance Information</h2>
      <Form.Item
        name={['proposal_basic_info', 'forum_url']}
        label={
          <span className="form-item-label">
            Discussion on Forum <span>(Optional)</span>
          </span>
        }
        rules={[
          {
            type: 'url',
            message: 'Please input a correct tmrwdao forum address',
          },
        ]}
      >
        <Input type="text" placeholder="https://URL" />
      </Form.Item>

      {/* Voters and executors: */}
      <Form.Item
        name={['proposal_basic_info', 'scheme_address']}
        label={<span className="form-item-label">Voters and executors</span>}
      >
        <ResponsiveSelect
          drawerProps={{
            title: 'Proposal Type',
          }}
          options={governanceMechanismOptions}
          optionLabelProp="label"
        ></ResponsiveSelect>
      </Form.Item>
      {/* 1a1v/1t1v */}
      <Form.Item
        name={['proposal_basic_info', 'vote_scheme_id']}
        label={<span className="form-item-label">Vote Model</span>}
        initialValue={voteScheme?.VoteSchemeList?.[0]?.VoteSchemeId}
      >
        <Radio.Group>
          {voteScheme?.VoteSchemeList.map((item) => {
            return (
              <Radio value={item.VoteSchemeId} key={item.VoteSchemeId}>
                {item.VoteMechanismName}
              </Radio>
            );
          })}
        </Radio.Group>
      </Form.Item>
      {/* contract address: */}
      <Form.Item
        name={['transaction', 'to_address']}
        label={<span className="form-item-label">Contract Address</span>}
      >
        <ResponsiveSelect
          drawerProps={{
            title: 'Contract Address',
          }}
          options={contractInfoOptions}
          optionLabelProp="label"
        ></ResponsiveSelect>
      </Form.Item>
      <Form.Item
        name={['transaction', 'contract_method_name']}
        label={<span className="form-item-label">Method Name</span>}
        dependencies={['transaction', 'to_address']}
      >
        <ResponsiveSelect
          drawerProps={{
            title: 'Method Name',
          }}
          options={contractMethodOptions}
          optionLabelProp="label"
        ></ResponsiveSelect>
      </Form.Item>
      <Form.Item
        name={['transaction', 'params']}
        label={<span className="form-item-label">Method Params</span>}
      >
        <Editor defaultLanguage="json" height={176} />
      </Form.Item>
      <Form.Item
        label={
          <ToolTip title="Estimated proposal active period. The active period starts from the proposal being published on the blockchain and lasts until {num} days later">
            <span className="form-item-label">Active Period</span>
          </ToolTip>
        }
      >
        <div className="flex h-[48px] px-[16px] py-[8px] items-center rounded-[6px] border-[1px] border-solid border-Neutral-Border bg-Neutral-Hover-BG">
          <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pr-[16px]">
            {formatDate(daoInfo)}
          </span>
          <ArrowIcon className="color-[#B8B8B8]" />
          <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pl-[16px]">
            12 Dec, 2024
          </span>
        </div>
      </Form.Item>
      <Form.Item
        label={
          <ToolTip title="Estimated proposal executable period. The executable period starts from the proposal being approved on the blockchain and lasts until {num} days later">
            <span className="form-item-label">Executable Period</span>
          </ToolTip>
        }
      >
        <div className="flex h-[48px] px-[16px] py-[8px] items-center rounded-[6px] border-[1px] border-solid border-Neutral-Border bg-Neutral-Hover-BG">
          <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pr-[16px]">
            05 Dec, 2024
          </span>
          <ArrowIcon className="color-[#B8B8B8]" />
          <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pl-[16px]">
            12 Dec, 2024
          </span>
        </div>
      </Form.Item>
      <div className="flex justify-end mt-[100px]">
        <Button
          type="primary"
          className="w-[156px]"
          // disabled={!title || !description}
          onClick={() => {
            console.log(
              'form.getFieldsValue()',
              form.validateFields().then((res) => console.log(res)),
            );
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default memo(ProposalInfo);
