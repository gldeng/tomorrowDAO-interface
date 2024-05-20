'use client';

import { Form, message as antdMessage } from 'antd';
import { memo, useState } from 'react';
import useNetworkDaoRouter from 'hooks/useNetworkDaoRouter';
import ProposalType from './ProposalType';
import ProposalInfo from './ProposalInfo';
import { IContractError, IFormValidateError, ProposalType as ProposalTypeEnum } from 'types';
import clsx from 'clsx';
import CommonOperationResultModal, {
  CommonOperationResultModalType,
  TCommonOperationResultModalProps,
} from 'components/CommonOperationResultModal';
import { proposalCreateContractRequest } from 'contract/proposalCreateContract';
import { emitLoading } from 'utils/myEvent';
import { parseJSON, uint8ToBase64 } from 'utils/parseJSON';
import { getContract } from '../util';
import { NetworkDaoProposalOnChain } from 'config';
import { useRouter } from 'next/navigation';
import useIsNetworkDao from 'hooks/useIsNetworkDao';
import formValidateScrollFirstError from 'utils/formValidateScrollFirstError';
// import { useWalletSyncCompleted } from 'hooks/useWalletSyncCompleted';

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
  const router = useNetworkDaoRouter();
  const { isNetWorkDao, networkDaoId } = useIsNetworkDao();
  const nextRouter = useRouter();
  const [resultModalConfig, setResultModalConfig] = useState(INIT_RESULT_MODAL_CONFIG);
  // const { getAccountInfoSync } = useWalletSyncCompleted();
  const { daoId } = props;
  const openErrorModal = (
    primaryContent = 'Failed to Create the proposal',
    secondaryContent = 'Failed to Create the proposal',
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
  const handleNext = () => {
    const proposalType = form.getFieldValue('proposalType');
    if (proposalType === NetworkDaoProposalOnChain.label) {
      router.push(`/apply`);
    } else {
      setNext(true);
    }
  };
  const handleSubmit = async () => {
    try {
      // const mainAddress = await getAccountInfoSync();
      // if (!mainAddress) return;
      if (!daoId) {
        openErrorModal();
      }
      const res = await form.validateFields();
      const contractParams = {
        ...res,
        proposalBasicInfo: {
          ...res.proposalBasicInfo,
          daoId,
        },
      };
      if (res.proposalType === ProposalTypeEnum.GOVERNANCE) {
        const params = res.transaction.params;
        const parsedParams = parseJSON(params);
        const contractInfo = await getContract(res.transaction.toAddress);
        const method = contractInfo[res.transaction.contractMethodName];
        let decoded;
        if (Array.isArray(parsedParams)) {
          decoded = method.packInput([...parsedParams]);
        } else if (typeof parsedParams === 'object' && parsedParams !== null) {
          decoded = method.packInput(JSON.parse(JSON.stringify(parsedParams)));
        } else {
          decoded = method.packInput(parsedParams);
        }
        const finalParams = uint8ToBase64(decoded || []) || [];
        contractParams.transaction = {
          ...res.transaction,
          params: finalParams,
        };
      }
      emitLoading(true, 'The transaction is being processed...');
      const methodName =
        res.proposalType === ProposalTypeEnum.VETO ? 'CreateVetoProposal' : 'CreateProposal';
      const createRes = await proposalCreateContractRequest(methodName, contractParams);
      console.log('proposalCreateContractRequest', createRes);

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
              children: 'OK',
              onClick: () => {
                antdMessage.open({
                  type: 'success',
                  content: 'created successfully, it will appear in the list in a few minutes',
                });
                nextRouter.push(
                  isNetWorkDao ? `/network-dao/${networkDaoId}/proposal-list` : `/dao/${daoId}`,
                );
              },
            },
          ],
          childrenNode: (
            // <Link
            //   href={`/proposal/${createRes.proposalId}`}
            //   className="color-[colorPrimary] font-500 leading-[22px] text-[14px] "
            // >
            //   View Proposal Details
            // </Link>
            <span></span>
          ),
        },
      });
    } catch (err) {
      if (typeof err === 'string') {
        antdMessage.open({
          type: 'error',
          content: 'Please check your internet connection and try again. ',
        });
        return;
      }
      const error = err as IFormValidateError | IContractError;
      // form Error
      if ('errorFields' in error) {
        formValidateScrollFirstError(form, error);
        return;
      }
      const message = error?.errorMessage?.message || error?.message;
      emitLoading(false);
      openErrorModal(undefined, message);
    }
  };
  return (
    <div className="deploy-proposal-form mt-[24px] mb-[24px]">
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
        <ProposalType className={clsx({ hidden: isNext })} next={handleNext} />
        <ProposalInfo className={clsx({ hidden: !isNext })} daoId={daoId} onSubmit={handleSubmit} />
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
