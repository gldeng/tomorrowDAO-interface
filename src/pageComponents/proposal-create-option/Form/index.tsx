import { Form, message as antdMessage, message } from 'antd';
import { Input, Tooltip, Button } from 'aelf-design';
import OptionDynamicList from './OptionDynamicList';
import AWSUpload from 'components/S3Upload';
import formValidateScrollFirstError from 'utils/formValidateScrollFirstError';
import { IContractError, IFormValidateError } from 'types';
import { useRouter } from 'next/navigation';
import { emitLoading } from 'utils/myEvent';
import {
  activeEndTimeName,
  activeStartTimeName,
  voterAndExecuteNamePath,
} from 'pageComponents/proposal-create/DeployForm/constant';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import { proposalCreateContractRequest } from 'contract/proposalCreateContract';
import { useAsyncEffect } from 'ahooks';
import { fetchGovernanceMechanismList } from 'api/request';
import { curChain } from 'config';
import { useMemo, useState } from 'react';
import { InfoCircleOutlined } from '@aelf-design/icons';
import { ButtonCheckLogin } from 'components/ButtonCheckLogin';
import ActiveEndTime, {
  defaultActiveEndTimeDuration,
} from 'pageComponents/proposal-create/DeployForm/ActiveEndTime';
import ActiveStartTime from 'pageComponents/proposal-create/DeployForm/ActiveStartTime';
import { ActiveStartTimeEnum } from 'pageComponents/proposal-create/type';
import { ProposalType as ProposalTypeEnum } from 'types';
import { EOptionType, ESourceType } from '../type';
import { showSuccessModal, showErrorModal } from 'utils/globalModal';
import { saveVoteOptions, fetchVoteSchemeList } from 'api/request';
import { formmatDescription } from '../utils';
import { getProposalTimeParams } from 'utils/getProposalTime';
interface IFormPageProps {
  daoId: string;
  optionType: EOptionType;
  aliasName: string;
}
export default function Page(props: IFormPageProps) {
  const { daoId, optionType, aliasName } = props;
  const nextRouter = useRouter();
  const [form] = Form.useForm();
  const proposalType = Form.useWatch('proposalType', form);
  const [governanceMechanismList, setGovernanceMechanismList] = useState<TGovernanceSchemeList>();
  const governanceMechanismOptions = useMemo(() => {
    return governanceMechanismList?.map((item) => {
      return {
        label: item.governanceMechanism,
        value: item.schemeAddress,
      };
    });
  }, [governanceMechanismList, proposalType]);
  useAsyncEffect(async () => {
    if (!daoId) {
      return;
    }
    const governanceMechanismListRes = await fetchGovernanceMechanismList({
      chainId: curChain,
      daoId: daoId,
    });
    setGovernanceMechanismList(governanceMechanismListRes.data.data);
  }, [daoId]);
  const handleSubmit = async () => {
    try {
      const res = await form.validateFields();
      emitLoading(true, 'Publishing the proposal...');
      console.log('res', res);
      const saveReqApps: ISaveAppListReq['apps'] = res.options.map((item: any) => {
        return {
          ...item,
          screenshots: item.screenshots?.map((screenshot: any) => screenshot.url),
          sourceType: ESourceType.TomorrowDao,
        };
      });
      if (res?.banner?.[0]?.url) {
        saveReqApps.push({
          title: 'TomorrowDaoBanner',
          icon: res?.banner?.[0]?.url,
          sourceType: ESourceType.TomorrowDao,
        });
      }
      const [saveRes, voteSchemeListRes] = await Promise.all([
        saveVoteOptions({
          chainId: curChain,
          apps: saveReqApps,
        }),
        fetchVoteSchemeList({ chainId: curChain, daoId: daoId }),
      ]);
      const appAlias = saveRes?.data ?? [];
      if (!appAlias.length) {
        throw new Error('Failed to create proposal, save options failed');
      }
      const formmatDescriptionStr = formmatDescription(appAlias);
      if (formmatDescriptionStr.length > 256) {
        throw new Error(
          'Too many options have been added, or the option names are too long. Please simplify the options and try again.',
        );
      }
      const voteSchemeId = voteSchemeListRes?.data?.voteSchemeList?.[0]?.voteSchemeId;
      if (!voteSchemeId) {
        throw new Error('The voting scheme for this DAO cannot be found');
      }
      const methodName = 'CreateProposal';
      const timeParams = getProposalTimeParams(
        res.proposalBasicInfo.activeStartTime,
        res.proposalBasicInfo.activeEndTime,
      );
      const proposalBasicInfo = {
        ...res.proposalBasicInfo,
        ...timeParams,
        proposalDescription: formmatDescriptionStr,
        daoId,
        voteSchemeId,
      };
      const contractParams = {
        proposalType: ProposalTypeEnum.ADVISORY,
        proposalBasicInfo: proposalBasicInfo,
      };
      /**
      {
    "proposalType": 2,
    "proposalBasicInfo": {
      "proposalTitle": "title",
      "proposalDescription": "1",
      "schemeAddress": "nwKhRXz5tZXe6PDDznqcxNuBPjk7DnHn8vVQDjbUnCy3MZJXN",
      "activeStartTime": 0,
      "activeEndTime": 0,
      "activeTimePeriod": 86400,
      "daoId": "9d929173f8244c1a5195098e027c687498c132f48d9ad640efe2ed958147d5eb",
      "voteSchemeId": "934d1295190d97e81bc6c2265f74e589750285aacc2c906c7c4c3c32bd996a64"
    }
  },
       */
      await proposalCreateContractRequest(methodName, contractParams);
      showSuccessModal({
        primaryContent: 'Proposal Published',
        secondaryContent: res.proposalBasicInfo.proposalTitle,
        onOk: () => {
          antdMessage.open({
            type: 'success',
            content: 'created successfully, it will appear in the list in a few minutes',
          });
          nextRouter.push(`/dao/${aliasName}`);
        },
      });
    } catch (err) {
      emitLoading(false);
      const error = err as IFormValidateError | IContractError;
      // form Error
      if (typeof error === 'object' && 'errorFields' in error) {
        formValidateScrollFirstError(form, error);
        return;
      }
      const msg =
        (error?.errorMessage?.message || error?.message || err?.toString()) ?? 'Unknown error';
      showErrorModal('Error', msg);
    }
  };
  return (
    <div className="deploy-proposal-options-form">
      <h3 className="card-title lg:mb-[32px] mb-[24px]">Create a List</h3>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={true}
        scrollToFirstError={true}
        name="dynamic_form_item"
      >
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
          name={'banner'}
          label={<span className="form-item-label">Banner</span>}
          valuePropName="fileList"
        >
          <AWSUpload
            maxFileCount={1}
            needCheckImgSize
            ratio={3.25}
            ratioErrorText="The ratio of the image is incorrect, please upload an image with a ratio of 3.25"
            tips={'Formats supported: PNG and JPG. Ratio: 3.25 (e.g., 390 / 120), less than 1 MB.'}
          />
        </Form.Item>
        <OptionDynamicList
          name={'options'}
          form={form}
          rules={[
            {
              validator: (_, value) => {
                return new Promise<void>((resolve, reject) => {
                  if (!value || !value?.length || value?.length < 2) {
                    reject('There should be more than 1 option, please add more options.');
                  }
                  resolve();
                });
              },
            },
          ]}
          optionType={optionType}
          initialValue={[
            {
              title: '',
            },
          ]}
        />
        <div className="card-title divide-title">Proposal Information</div>
        <Form.Item
          name={voterAndExecuteNamePath}
          required
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
        <Form.Item
          className="voting-start-time-form-label"
          label={
            <Tooltip title="Define when a proposal should be active to receive approvals. If now is selected, the proposal is immediately active after publishing.">
              <span className="form-item-label">
                Voting start time
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
      </Form>

      <div className="flex justify-end mt-[100px]">
        <ButtonCheckLogin
          type="primary"
          className="w-[156px]"
          // disabled={!title || !description}
          onClick={handleSubmit}
          loading={false}
        >
          Submit
        </ButtonCheckLogin>
      </div>
    </div>
  );
}
