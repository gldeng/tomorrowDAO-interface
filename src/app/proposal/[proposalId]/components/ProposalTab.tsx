import { Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { Tabs } from 'aelf-design';
import { getContract } from 'app/proposal/deploy/[daoId]/util';
import { MarkdownPreview } from 'components/MarkdownEditor';
import { curChain } from 'config';
import { useEffect, useState } from 'react';
import { ProposalTypeString } from 'types';
import base64ToHex from 'utils/base64ToHex';

interface IProposalTabProps {
  proposalDetailData?: IProposalDetailData;
}
interface IContractParamsProps {
  address: string;
  methodName: string;
  params: string;
}
const ContractParams = (props: IContractParamsProps) => {
  const { address, methodName, params } = props;
  const [parsedParams, setParams] = useState(params);
  useEffect(() => {
    if (!address || !methodName || !params) {
      return;
    }
    getContract(address)
      .then((contract) => {
        const decoded = contract[methodName].unpackPackedInput(base64ToHex(params));
        setParams(JSON.stringify(decoded, null, 2));
      })
      .catch((e) => {
        console.error('contract params decode error', e);
      });
  }, [address, methodName, params]);
  return <pre className="view-params">{parsedParams}</pre>;
};
const ProposalTab = (props: IProposalTabProps) => {
  const { proposalDetailData } = props;
  const tabItems = [
    {
      key: '1',
      label: <span className="flex flex-col lg:flex-row">Description</span>,
      children: (
        <div className="text-base px-8 py-4">
          <div className="custom-html-style">
            <MarkdownPreview text={proposalDetailData?.proposalDescription ?? ''} />
          </div>
        </div>
      ),
    },
  ];
  if (proposalDetailData?.proposalType === ProposalTypeString.Governance) {
    tabItems.push({
      key: '2',
      label: (
        <span className="flex flex-col lg:flex-row">
          <span>Contract</span>
          <span className="lg:pl-[4px] pl-[0px]">Information</span>
        </span>
      ),
      children: (
        <div className="text-base	px-8 py-4">
          <div className="flex flex-col gap-2 pb-8">
            <div>
              <Typography.Text fontWeight={FontWeightEnum.Medium}>Call Method</Typography.Text>
            </div>
            <div>
              <Typography.Text className="text-Neutral-Secondary-Text">
                {proposalDetailData?.transaction?.contractMethodName ?? '-'}
              </Typography.Text>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-8">
            <div>
              <Typography.Text fontWeight={FontWeightEnum.Medium}>Call Contract</Typography.Text>
            </div>
            <div>
              <HashAddress
                address={proposalDetailData?.transaction?.toAddress ?? '-'}
                chain={curChain}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <Typography.Text fontWeight={FontWeightEnum.Medium}>Contract Params</Typography.Text>
            </div>
            <div className="p-4 rounded-md bg-[#F8F8F8]">
              <ContractParams
                address={proposalDetailData?.transaction?.toAddress}
                methodName={proposalDetailData?.transaction?.contractMethodName}
                params={proposalDetailData?.transaction?.params?.param}
              />
            </div>
          </div>
        </div>
      ),
    });
  }
  return <Tabs items={tabItems} />;
};
export { ProposalTab };
