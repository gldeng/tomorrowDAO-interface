'use client';

import { Form } from 'antd';
import { memo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import Link from 'next/link';
import ProtoInstance from 'utils/decode-log';
import { propalAddress } from 'config';
import { parseJSON, uint8ToBase64 } from 'utils/parseJSON';
import { getContract } from '../util';

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
  const router = useRouter();
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
  const handleSubmit = async (voteSchemeId: string) => {
    try {
      if (!daoId) {
        openErrorModal();
      }
      const res = await form.validateFields();
      const params = res.transaction.params;
      // todo decode params
      const parsedParams = parseJSON(params);
      const contractInfo = await getContract(res.transaction.toAddress);
      console.log('contractInfo', contractInfo);
      const method = contractInfo[res.transaction.contractMethodName];
      let decoded;
      if (Array.isArray(parsedParams)) {
        console.log(1);
        decoded = method.packInput([...parsedParams]);
      } else if (typeof parsedParams === 'object' && parsedParams !== null) {
        console.log(2);
        decoded = method.packInput(JSON.parse(JSON.stringify(parsedParams)));
      } else {
        console.log(3);
        decoded = method.packInput(parsedParams);
      }
      console.log('decoded', decoded);
      // window.btoa(params);
      const finalParams = uint8ToBase64(decoded || []) || [];
      // const finalParams = window.btoa(params);
      // const finalParams = params;
      const contractParams = {
        ...res,
        proposalBasicInfo: {
          ...res.proposalBasicInfo,
          daoId,
        },
      };
      if (res.proposalType === ProposalTypeEnum.GOVERNANCE) {
        contractParams.transaction = {
          ...res.transaction,
          params: finalParams,
        };
      }
      emitLoading(true, 'The transaction is being processed...');
      const methodName =
        res.proposalType === ProposalTypeEnum.VETO ? 'CreateVetoProposal' : 'CreateProposal';
      const createRes = await proposalCreateContractRequest(methodName, contractParams);
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
              children: 'OK',
              onClick: () => {
                router.push(`/dao/${daoId}`);
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
      const error = err as IFormValidateError | IContractError;
      // form Error
      if ('errorFields' in error) {
        return;
      }
      console.log('error', error);
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
        <ProposalType
          className={clsx({ hidden: isNext })}
          next={() => {
            setNext(true);
          }}
        />
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
