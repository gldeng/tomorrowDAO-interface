'use client';

import { Radio, Input, Tooltip, Button } from 'aelf-design';
import { Form, Select } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { proposalCreateContractRequest } from 'contract/proposalCreateContract';

const { Option } = Select;
interface ProposalInfoProps {
  next?: () => void;
  className?: string;
}
const ProposalInfo = (props: ProposalInfoProps) => {
  const [governanceMechanismList, setGovernanceMechanismList] = useState<GovernanceMechanismList>();
  const searchParams = useSearchParams();
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
  const contractAddress = Form.useWatch(['transaction', 'toAddress'], form);
  const proposalType = Form.useWatch('proposalType', form);
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
        name={['proposalBasicInfo', 'proposalTitle']}
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
        name={['proposalBasicInfo', 'proposalDescription']}
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
        name={['proposalBasicInfo', 'forumUrl']}
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
        name={['proposalBasicInfo', 'schemeAddress']}
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
        name={['proposalBasicInfo', 'voteSchemeId']}
        label={<span className="form-item-label">Vote Model</span>}
        initialValue={voteScheme?.VoteSchemeList?.[0]?.VoteSchemeId}
      >
        <Radio.Group>
          {voteScheme?.VoteSchemeList.map((item) => {
            return (
              <Radio value={item.VoteSchemeId} key={item.VoteMechanismName}>
                {item.VoteMechanismName}
              </Radio>
            );
          })}
        </Radio.Group>
      </Form.Item>
      {/* contract address: */}
      <Form.Item
        name={['transaction', 'toAddress']}
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
        name={['transaction', 'contractMethodName']}
        label={<span className="form-item-label">Method Name</span>}
        dependencies={['transaction', 'toAddress']}
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
          <Tooltip title="Estimated proposal active period. The active period starts from the proposal being published on the blockchain and lasts until {num} days later">
            <span className="form-item-label">Active Period</span>
          </Tooltip>
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
          <Tooltip title="Estimated proposal executable period. The executable period starts from the proposal being approved on the blockchain and lasts until {num} days later">
            <span className="form-item-label">Executable Period</span>
          </Tooltip>
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
            const daoId = searchParams.get('daoId');
            if (!daoId) {
              throw new Error('daoId is required');
            }
            form.validateFields().then(async (res) => {
              const params = {
                ...res,
                proposalBasicInfo: {
                  ...res.proposalBasicInfo,
                  daoId,
                },
              };
              console.log('res------- input', res);
              // const params = {
              //   proposalBasicInfo: {
              //     daoId: '58ce59423ec3b437603e05e6990cb56dfa04a3338a5f8f25350568ac29dd6c29',
              //     proposalTitle: 'Proposal Title',
              //     proposalDescription:
              //       'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
              //     forumUrl: 'https://forum.example.com',
              //     // vote and executor
              //     schemeAddress: 'D29ezPPDCKL3UJxUUyabtz6tdWzztSqczSRbpRfyYvpn9Bmq9',
              //     // vote model
              //     voteSchemeId:
              //       '632e4047edc35bdf06de385f46fd553ef454ddf7d1bfd060cc341e6dba237510',
              //   },
              //   proposalType: 1,
              //   transaction: {
              //     contractMethodName: 'ChangeCodeCheckController',
              //     toAddress: 'pykr77ft9UUKJZLVq15wCH8PinBSjVRQ12sD1Ayq92mKFsJ1i',
              //     params: '123',
              //   },
              // };
              console.log('res', params);
              const createRes = proposalCreateContractRequest('CreateProposal', params);
              console.log('res', createRes);
            });
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default memo(ProposalInfo);
