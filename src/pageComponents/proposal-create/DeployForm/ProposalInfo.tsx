'use client';

import { Input, Tooltip, Button } from 'aelf-design';
import { InfoCircleOutlined } from '@aelf-design/icons';
import { Form, Switch } from 'antd';
import { memo, useMemo, useState } from 'react';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import MarkdownEditor from 'components/MarkdownEditor';
import { ReactComponent as ArrowIcon } from 'assets/imgs/arrow-icon.svg';
import { ContractMethodType, ProposalType, proposalTypeList } from 'types';
import { fetchGovernanceMechanismList } from 'api/request';
import { curChain } from 'config';
import { useAsyncEffect } from 'ahooks';
import { GetDaoProposalTimePeriodContract } from 'contract/callContract';
import dayjs from 'dayjs';
import { HighCouncilName, ReferendumName, Organization } from 'constants/proposal';
import ActionTabs from './ActionTabs/index';
import { ActiveStartTimeEnum } from '../type';
import { SkeletonTab } from 'components/Skeleton';
import ActiveStartTime from './ActiveStartTime';
import ActiveEndTime, { defaultActiveEndTimeDuration } from './ActiveEndTime';
import { getTimeMilliseconds } from '../util/time';
import { voterAndExecuteNamePath } from './constant';

const periodName = ['proposalBasicInfo', 'activeTimePeriod'];
const isAnonymousName = ['proposalBasicInfo', 'isAnonymous'];
const activeStartTimeName = ['proposalBasicInfo', 'activeStartTime'];
const activeEndTimeName = ['proposalBasicInfo', 'activeEndTime'];
interface ProposalInfoProps {
  next?: () => void;
  className?: string;
  daoId: string;
  daoData?: IDaoInfoData;
  onSubmit: () => void;
  onTabChange?: (activeKey: string) => void;
  activeTab?: string;
  treasuryAssetsData?: ITreasuryAssetsResponseDataItem[];
  daoDataLoading?: boolean;
  isValidating?: boolean;
}

const ProposalInfo = (props: ProposalInfoProps) => {
  const [governanceMechanismList, setGovernanceMechanismList] = useState<TGovernanceSchemeList>();
  // const [voteScheme, setVoteScheme] = useState<IVoteSchemeListData>();
  const [timePeriod, setTimePeriod] = useState<ITimePeriod | null>(null);

  const {
    className,
    daoId,
    onSubmit,
    onTabChange,
    activeTab,
    treasuryAssetsData,
    daoData,
    daoDataLoading,
    isValidating,
  } = props;

  const form = Form.useFormInstance();

  const proposalType = Form.useWatch('proposalType', form);
  const voterAndExecute = Form.useWatch(voterAndExecuteNamePath, form);
  const isAnonymous = Form.useWatch(isAnonymousName, form);
  const activeTimePeriod = Form.useWatch(periodName, form);
  const activeEndTime = Form.useWatch(activeEndTimeName, form);
  const activeStartTime = Form.useWatch(activeStartTimeName, form);
  const timeMilliseconds = useMemo(() => {
    return getTimeMilliseconds(activeStartTime, activeEndTime);
  }, [activeEndTime, activeStartTime]);
  const anonymousVotingStartTimeString = useMemo(() => {
    if (isAnonymous && !!timeMilliseconds.activeStartTime && !!timeMilliseconds.activeEndTime) {
      const start = dayjs(timeMilliseconds.activeStartTime);
      const end = dayjs(timeMilliseconds.activeEndTime);
      return start.add(end.diff(start) / 2).format('YYYY-MM-DD HH:mm:ss');
    }
  }, [timeMilliseconds]);
  const currentGovernanceMechanism = useMemo(() => {
    return governanceMechanismList?.find((item) => item.schemeAddress === voterAndExecute);
  }, [voterAndExecute, governanceMechanismList]);
  const isReferendumLike = [Organization, ReferendumName].includes(
    currentGovernanceMechanism?.governanceMechanism ?? '',
  );
  const isHighCouncil = currentGovernanceMechanism?.governanceMechanism === HighCouncilName;
  const isGovernance = proposalType === ProposalType.GOVERNANCE;

  const governanceMechanismOptions = useMemo(() => {
    return governanceMechanismList?.map((item) => {
      return {
        label: item.governanceMechanism,
        value: item.schemeAddress,
        disabled:
          proposalType === ProposalType.VETO && item.governanceMechanism === HighCouncilName,
      };
    });
  }, [governanceMechanismList, proposalType]);

  useAsyncEffect(async () => {
    const governanceMechanismListRes = await fetchGovernanceMechanismList({
      chainId: curChain,
      daoId: daoId,
    });
    setGovernanceMechanismList(governanceMechanismListRes.data.data);
    // setVoteScheme(voteSchemeListRes.data);
  }, [daoId]);
  const proposalDetailDesc = useMemo(() => {
    return proposalTypeList.find((item) => item.value === proposalType)?.desc ?? '';
  }, [proposalType]);
  // const
  useAsyncEffect(async () => {
    const timePeriod = await GetDaoProposalTimePeriodContract(daoId, {
      type: ContractMethodType.VIEW,
    });
    setTimePeriod(timePeriod);
  }, [daoId]);
  return (
    <div className={`${className} proposal-form`}>
      <h2 className="text-[20px] leading-[28px] font-weight">Create a Proposal</h2>
      <p className=" text-[16px] leading-[24px] text-Neutral-Secondary-Text font-normal mt-[8px] mb-[64px]">
        {proposalDetailDesc}
      </p>
      <Form.Item
        name={['proposalBasicInfo', 'proposalTitle']}
        label={<span className="form-item-label">Title</span>}
        validateFirst
        rules={[
          {
            required: true,
            message: 'The proposal title is required',
          },
          {
            min: 0,
            max: 300,
            message: 'The proposal title supports a maximum of 300 characters',
          },
        ]}
      >
        <Input type="text" placeholder="Enter the title of the proposal (300 characters max)" />
      </Form.Item>
      <Form.Item
        name={['proposalBasicInfo', 'proposalDescription']}
        label={<span className="form-item-label">Description</span>}
        validateFirst
        rules={[
          {
            required: true,
            message: 'The proposal description is required',
          },
          {
            min: 0,
            max: 256,
            message: 'The proposal description supports a maximum of 300,000 characters',
          },
        ]}
      >
        <MarkdownEditor maxLen={256} id="proposalBasicInfo_proposalDescription" />
      </Form.Item>

      {/* Discussion on forum */}
      <h2 className="title-primary mb-[24px]">
        {isGovernance ? 'Governance Information' : 'Proposal Information'}
      </h2>
      {/* <Form.Item
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
      </Form.Item> */}
      {/* veto proposal id */}
      {proposalType === ProposalType.VETO && (
        <Form.Item
          name={'vetoProposalId'}
          label={
            <Tooltip title="You can find the published proposal id on the proposal details page">
              <span className="form-item-label">
                Veto proposal id <InfoCircleOutlined className="cursor-pointer label-icon" />
              </span>
            </Tooltip>
          }
          rules={[
            {
              required: true,
              message: 'the veto proposal id is required',
              max: 100,
            },
          ]}
        >
          <Input type="text" placeholder="Enter the veto proposal id" />
        </Form.Item>
      )}

      {/* Voters and executors: */}
      <Form.Item
        name={voterAndExecuteNamePath}
        label={<span className="form-item-label">Voters and executors</span>}
        rules={[
          {
            required: true,
            message: 'voters and executors is required',
          },
        ]}
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
      {/* <Form.Item
        name={voteSchemeName}
        label={<span className="form-item-label">Voting mechanism</span>}
        initialValue={voteScheme?.voteSchemeList?.[0]?.voteSchemeId}
        rules={[
          {
            required: true,
            message: 'vote model is required',
          },
        ]}
      >
        <Radio.Group>
          {voteScheme?.voteSchemeList.map((item) => {
            const isDisabled =
              activeTab === EProposalActionTabs.TREASURY &&
              EVoteMechanismNameType.UniqueVote === item.voteMechanismName &&
              proposalType === ProposalType.GOVERNANCE;
            return (
              <Radio value={item.voteSchemeId} key={item.voteSchemeId} disabled={isDisabled}>
                {VoteMechanismNameLabel[item.voteMechanismName]}
              </Radio>
            );
          })}
        </Radio.Group>
      </Form.Item> */}
      {/* transaction: */}
      {proposalType === ProposalType.GOVERNANCE &&
        (daoDataLoading ? (
          <SkeletonTab />
        ) : (
          <ActionTabs
            onTabChange={onTabChange}
            daoId={daoId}
            activeTab={activeTab}
            treasuryAssetsData={treasuryAssetsData}
            daoData={daoData}
            governanceMechanismList={governanceMechanismList ?? []}
          />
        ))}

      {/* Enable anonymous voting */}
      <Form.Item
        name={isAnonymousName}
        label={
          <Tooltip title="Enable anonymous voting to hide voter identities during the voting process">
            <span className="form-item-label">
              Enable anonymous voting
              <InfoCircleOutlined className="cursor-pointer label-icon" />
            </span>
          </Tooltip>
        }
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </Form.Item>

      <Form.Item
        className="voting-start-time-form-label"
        label={
          <Tooltip title="Define when a proposal should be active to receive approvals. If now is selected, the proposal is immediately active after publishing.">
            <span className="form-item-label">
              {!!isAnonymous ? 'Commitment registration start time' : 'Voting start time'}
              <InfoCircleOutlined className="cursor-pointer label-icon" />
            </span>
          </Tooltip>
        }
        initialValue={ActiveStartTimeEnum.now}
        name={activeStartTimeName}
        rules={[
          {
            required: true,
            message: 'The voting start time is required',
          },
        ]}
      >
        <ActiveStartTime />
      </Form.Item>


      {/* Display-only field for Anonymous Voting start time */}
      {!!isAnonymous && anonymousVotingStartTimeString && (
        <Form.Item
          label={
            <Tooltip title="The anonymous voting start time is automatically set to the middle of the commitment registration period and the voting end time.">
              <span className="form-item-label">
                Anonymous Voting start time
                <InfoCircleOutlined className="cursor-pointer label-icon" />
              </span>
            </Tooltip>
          }
        >
          <Input
            value={anonymousVotingStartTimeString}
            disabled
            style={{ color: 'rgba(0, 0, 0, 0.85)' }}
          />
        </Form.Item>
      )}

      {/* Voting end date */}
      <Form.Item
        label={
          <Tooltip title="Define how long the voting should last in days, or add an exact date and time for it to conclude.">
            <span className="form-item-label">
              Voting end date
              <InfoCircleOutlined className="cursor-pointer label-icon" />
            </span>
          </Tooltip>
        }
        initialValue={defaultActiveEndTimeDuration}
        name={activeEndTimeName}
        rules={[
          {
            required: true,
            message: 'The voting end time is required',
          },
          {
            validator: (_, value) => {
              return new Promise<void>((resolve, reject) => {
                if (Array.isArray(value)) {
                  if (value.every((item) => item === 0)) {
                    reject('The voting end time is required');
                  }
                  const [minutes, hours, days] = value;
                  const totalDays = days + hours / 24 + minutes / 1440;
                  if (totalDays > 365) {
                    reject('The maximum duration is 365 days');
                  }
                }
                resolve();
              });
            },
          },
        ]}
      >
        <ActiveEndTime />
      </Form.Item>
      {/* <Form.Item
        label={
          <Tooltip title="If the proposal is initiated around or at UTC 00:00 and is created after 00:00, the creation date will be the second day. As a result, the voting period will be extended by one day.">
            <span className="form-item-label">
              Voting Period
              <InfoCircleOutlined className="cursor-pointer label-icon" />
            </span>
          </Tooltip>
        }
        initialValue={1}
        name={periodName}
        extra={
          activeTimePeriod && (
            <div className="flex h-[48px] px-[16px] py-[8px] items-center rounded-[6px] border-[1px] border-solid border-Neutral-Border bg-Neutral-Hover-BG mt-[16px]">
              <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pr-[16px]">
                {dayjs().format('DD MMM, YYYY')}
              </span>
              <ArrowIcon className="color-[#B8B8B8]" />
              <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pl-[16px]">
                {activeTimePeriod
                  ? dayjs().add(Number(activeTimePeriod), 'hours').format('DD MMM, YYYY')
                  : '-'}
              </span>
            </div>
          )
        }
      >
        <RadioButtons
          options={[
            {
              label: '1 Hour',
              value: 1,
            },
            {
              label: '1 Day',
              value: 1 * 24,
            },
            {
              label: '3 Days',
              value: 1 * 24 * 3,
            },
          ]}
        />
      </Form.Item> */}

      {/* 
  advisory -> null
  Vote -> [now + activeTimePeriod, now + activeTimePeriod + executeTimePeriod]
  Governance 
    R: [now + activeTimePeriod, now + activeTimePeriod + executeTimePeriod]
    H: [now + activeTimePeriod + pendingTimePeriod
  , now + activeTimePeriod + executeTimePeriod + pendingTimePeriod]
      */}

      {[ProposalType.VETO, ProposalType.GOVERNANCE].includes(proposalType) &&
        currentGovernanceMechanism && (
          <Form.Item
            label={
              <Tooltip title="If the proposal is initiated around or at UTC 00:00 and is created after 00:00, the creation date will be the second day. As a result, the execution period will be extended by one day.">
                <span className="form-item-label">
                  Execution Period
                  <InfoCircleOutlined className="cursor-pointer label-icon" />
                </span>
              </Tooltip>
            }
          >
            <div className="flex h-[48px] px-[16px] py-[8px] items-center rounded-[6px] border-[1px] border-solid border-Neutral-Border bg-Neutral-Hover-BG">
              <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pr-[16px]">
                {(proposalType === ProposalType.VETO || (isGovernance && isReferendumLike)) &&
                  dayjs(timeMilliseconds?.activeEndTime).format('DD MMM, YYYY')}
                {isGovernance &&
                  isHighCouncil &&
                  dayjs(timeMilliseconds?.activeEndTime)
                    .add(Number(timePeriod?.pendingTimePeriod), 'seconds')
                    .format('DD MMM, YYYY')}
              </span>
              <ArrowIcon className="color-[#B8B8B8]" />
              <span className="text-neutralTitle text-[14px] font-400 leading-[22px] pl-[16px]">
                {(proposalType === ProposalType.VETO || (isGovernance && isReferendumLike)) &&
                  dayjs(timeMilliseconds?.activeEndTime)
                    .add(Number(timePeriod?.executeTimePeriod), 'seconds')
                    .format('DD MMM, YYYY')}
                {isGovernance &&
                  isHighCouncil &&
                  dayjs(timeMilliseconds?.activeEndTime)
                    .add(Number(timePeriod?.pendingTimePeriod), 'seconds')
                    .add(Number(timePeriod?.executeTimePeriod), 'seconds')
                    .format('DD MMM, YYYY')}
              </span>
            </div>
          </Form.Item>
        )}

      <div className="flex justify-end mt-[100px]">
        <Button
          type="primary"
          className="w-[156px]"
          // disabled={!title || !description}
          onClick={() => {
            onSubmit();
          }}
          loading={isValidating}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default memo(ProposalInfo);
