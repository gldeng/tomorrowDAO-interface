'use client';

import { Radio, Input, Tooltip, Button } from 'aelf-design';
import { Form, Select } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import MarkdownEditor from 'components/MarkdownEditor';
import Editor from '@monaco-editor/react';
import { ReactComponent as ArrowIcon } from 'assets/imgs/arrow-icon.svg';
import { proposalTypeList } from 'types';
import {
  fetchGovernanceMechanismList,
  fetchContractInfo,
  fetchDaoInfo,
  fetchVoteSchemeList,
} from 'api/request';
// import { VoteSchemeListRes, fetchVoteSchemeList } from '../type';
import { formatDate } from '../util';
import { proposalCreateContractRequest } from 'contract/proposalCreateContract';
import { useSelector } from 'redux/store';

const contractMethodNamePath = ['transaction', 'contractMethodName'];
const VoteSchemeList = [
  {
    VoteMechanismName: '1a1v',
    VoteSchemeId: '1a1v',
  },
  {
    VoteMechanismName: '1t1v',
    VoteSchemeId: '1t1v',
  },
];
const { Option } = Select;
interface ProposalInfoProps {
  next?: () => void;
  className?: string;
  daoId: string;
  onSubmit: (voteSchemeId: string) => void;
}
const ProposalInfo = (props: ProposalInfoProps) => {
  const [governanceMechanismList, setGovernanceMechanismList] = useState<GovernanceSchemeList>();
  const searchParams = useSearchParams();
  const [daoInfo, setDaoInfo] = useState<DaoInfoData>();
  const [contractInfo, setContractInfo] = useState<ContractInfoListData>();
  // const [voteScheme, setVoteScheme] = useState<IVoteSchemeListData>();

  // const info = store.getState().elfInfo.elfInfo;
  const elfInfo = useSelector((state) => state.elfInfo.elfInfo);
  const { className, daoId, onSubmit } = props;

  const governanceMechanismOptions = useMemo(() => {
    return governanceMechanismList?.map((item) => {
      // const isHighCouncil = item.name === 'High Council';
      // let num = daoInfo?.memberCount ?? 0;
      // if (!daoInfo?.governanceToken) {
      //   num = 0;
      // }
      // return {
      //   label: isHighCouncil ? `High Council (${num} members)` : item.name,
      //   disabled: num === 0,
      //   value: item.governanceSchemeId,
      // };
      return {
        label: item.governanceMechanism,
        value: item.schemeAddress,
      };
    });
  }, [governanceMechanismList]);
  const contractInfoOptions = useMemo(() => {
    return contractInfo?.contractInfoList.map((item) => {
      return {
        label: item.contractName,
        value: item.contractAddress,
      };
    });
  }, [contractInfo]);
  const form = Form.useFormInstance();
  const contractAddress = Form.useWatch(['transaction', 'toAddress'], form);
  const proposalType = Form.useWatch('proposalType', form);
  const schemeAddress = Form.useWatch(['proposalBasicInfo', 'schemeAddress'], form);
  const voteSchemeId = useMemo(() => {
    const governanceMechanism = governanceMechanismList?.find(
      (item) => item.schemeAddress === schemeAddress,
    );
    return governanceMechanism?.schemeId;
  }, [schemeAddress, governanceMechanismList]);
  console.log('voteSchemeId', voteSchemeId);
  const contractMethodOptions = useMemo(() => {
    const contract = contractInfo?.contractInfoList.find(
      (item) => item.contractAddress === contractAddress,
    );
    return (
      contract?.functionList?.map((item) => {
        return {
          label: item,
          value: item,
        };
      }) ?? []
    );
  }, [contractInfo, contractAddress]);
  useEffect(() => {
    const run = async () => {
      const [
        governanceMechanismListRes,
        daoInfo,
        contractInfo,
        // voteSchemeListRes
      ] = await Promise.all([
        fetchGovernanceMechanismList({ chainId: elfInfo.curChain, daoId: daoId }),
        fetchDaoInfo({ chainId: elfInfo.curChain, daoId: daoId }),
        fetchContractInfo({ chainId: elfInfo.curChain }),
        // fetchVoteSchemeList({ chainId: elfInfo.curChain, types: [1, 2] }),
      ]);
      setGovernanceMechanismList(governanceMechanismListRes.data.data);
      setDaoInfo(daoInfo.data);
      setContractInfo(contractInfo.data);
      // setVoteScheme(voteSchemeListRes.data);
    };
    run();
  }, []);
  const proposalDetailDesc = useMemo(() => {
    return proposalTypeList.find((item) => item.value === proposalType)?.detailDesc ?? '';
  }, [proposalType]);
  // reset Method Name if Contract Address change
  useEffect(() => {
    const methodName = form.getFieldValue(contractMethodNamePath);
    if (!contractInfo?.contractInfoList.includes(methodName)) {
      form.setFieldValue(contractMethodNamePath, undefined);
    }
  }, [contractAddress, form, contractInfo]);
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
        name={['proposalBasicInfo', 'deleteVoteSchemeId']}
        label={<span className="form-item-label">Vote Model</span>}
        initialValue={VoteSchemeList[0].VoteSchemeId}
      >
        <Radio.Group>
          {VoteSchemeList.map((item) => {
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
        name={contractMethodNamePath}
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
            readonly value
            {/* {formatDate(daoInfo)} */}
          </span>
          <ArrowIcon className="color-[#B8B8B8]" />
          <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pl-[16px]">
            {/* 12 Dec, 2024 */}
            readonly value
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
            {/* 05 Dec, 2024 */}
            readonly value
          </span>
          <ArrowIcon className="color-[#B8B8B8]" />
          <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pl-[16px]">
            {/* 12 Dec, 2024 */}
            readonly value
          </span>
        </div>
      </Form.Item>
      <div className="flex justify-end mt-[100px]">
        <Button
          type="primary"
          className="w-[156px]"
          // disabled={!title || !description}
          onClick={() => {
            onSubmit(voteSchemeId ?? '');
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default memo(ProposalInfo);
