'use client';

import { Form } from 'antd';
import { memo, useState } from 'react';
import ProposalType from './ProposalType';
import ProposalInfo from './ProposalInfo';
import clsx from 'clsx';
import CommonOperationResultModal, {
  CommonOperationResultModalType,
  TCommonOperationResultModalProps,
} from 'components/CommonOperationResultModal';
import { proposalCreateContractRequest } from 'contract/proposalCreateContract';
import { emitLoading } from 'utils/myEvent';
import Link from 'next/link';

interface IGovernanceModelProps {
  daoId: string;
}
type TResultModalConfig = Pick<
  TCommonOperationResultModalProps,
  'open' | 'type' | 'primaryContent' | 'secondaryContent' | 'footerConfig'
>;
const INIT_RESULT_MODAL_CONFIG: TResultModalConfig = {
  open: false,
  type: CommonOperationResultModalType.Success,
  primaryContent: '',
  secondaryContent: '',
};
const GovernanceModel = (props: IGovernanceModelProps) => {
  const [form] = Form.useForm();
  const [isNext, setNext] = useState(false);
  const [resultModalConfig, setResultModalConfig] = useState(INIT_RESULT_MODAL_CONFIG);
  const title = Form.useWatch(['proposal_basic_info', 'proposal_title'], form);
  const description = Form.useWatch(['proposal_basic_info', 'proposal_description'], form);
  const { daoId } = props;
  const openErrorModal = (
    primaryContent = 'Failed to Create the DAO',
    secondaryContent = 'Failed to Create the DAO',
  ) => {
    setResultModalConfig({
      open: true,
      type: CommonOperationResultModalType.Error,
      primaryContent: primaryContent,
      secondaryContent: secondaryContent,
      footerConfig: {
        buttonList: [
          {
            children: 'Back',
            onClick: () => {
              setResultModalConfig(INIT_RESULT_MODAL_CONFIG);
            },
          },
        ],
      },
    });
  };
  const hadnleSubmit = (voteSchemeId: string) => {
    try {
      if (!daoId) {
        openErrorModal();
      }
      form.validateFields().then(async (res) => {
        const params = {
          ...res,
          proposalBasicInfo: {
            ...res.proposalBasicInfo,
            daoId,
            voteSchemeId: voteSchemeId,
          },
        };
        delete params.proposalBasicInfo.deleteVoteSchemeId;
        emitLoading(true, 'Submitting the proposal...');
        console.log('res------- input', params);
        console.log('res', params);
        const createRes = await proposalCreateContractRequest('CreateProposal', params);
        console.log('res', createRes);
        emitLoading(false);
        setResultModalConfig({
          open: true,
          type: CommonOperationResultModalType.Success,
          primaryContent: 'Proposal Submitted!',
          secondaryContent: (
            <>
              {res.proposalBasicInfo.proposalTitle}:{res.proposalBasicInfo.proposalDescription}
            </>
          ),
          footerConfig: {
            buttonList: [
              {
                children: (
                  <span
                    onClick={() => {
                      setResultModalConfig(INIT_RESULT_MODAL_CONFIG);
                    }}
                  >
                    OK
                  </span>
                ),
              },
            ],
            childrenNode: (
              <Link
                href={`/`}
                className="color-[colorPrimary] font-500 leading-[22px] text-[14px] "
              >
                View Proposal Details
              </Link>
            ),
          },
        });
      });
    } catch (error) {
      emitLoading(false);
      openErrorModal();
    }
  };
  return (
    <div className="deploy-proposal-form mt-[24px] mb-[24px]">
      {/* <button
        onClick={async () => {
          let params = {
            proposalType: 2,
            proposalBasicInfo: {
              proposalTitle: '2121',
              proposalDescription: '21212',
              forumUrl: 'http://baidu.com',
              schemeAddress: '8XepdGhyo27gUQNVzqq7GVvdEvMDXcxqPuQpXvBkooxzDb34S',
              daoId: 'ce67effe8525732b8d07687302dd22cb0795582899e067387ce3a8fffb1fb71d',
              voteSchemeId: '06c84e65f48d95959cb580bfe13c45a3f5eec2ecb7851dc44e2f0b4362adafbc',
            },
            transaction: {
              toAddress: '2sJ8MDufVDR3V8fDhBPUKMdP84CUf1oJroi9p8Er1yRvMp3fq7',
              contractMethodName: 'CreateTreasury',
              params: 21,
            },
          };
          const createRes = proposalCreateContractRequest('CreateProposal', params);
        }}
      >
        debug
      </button> */}
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}
        scrollToFirstError={true}
        onValuesChange={(changedValues) => {
          if (changedValues?.transaction?.to_address) {
            form.setFieldValue(['transaction', 'contractMethodName'], '');
            form.setFieldValue(['transaction', 'params'], '');
          }
        }}
      >
        <ProposalType
          className={clsx({ hidden: isNext })}
          next={() => {
            setNext(true);
          }}
        />
        <ProposalInfo className={clsx({ hidden: !isNext })} daoId={daoId} onSubmit={hadnleSubmit} />
      </Form>
      <CommonOperationResultModal
        {...resultModalConfig}
        onCancel={() => {
          setResultModalConfig(INIT_RESULT_MODAL_CONFIG);
        }}
      />
    </div>
  );
};

export default memo(GovernanceModel);
