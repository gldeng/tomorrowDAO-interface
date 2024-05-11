import { Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { Tabs } from 'aelf-design';

interface IProposalTabProps {
  proposalDetailData?: ProposalDetailData;
}
const ProposalTab = (props: IProposalTabProps) => {
  const { proposalDetailData } = props;
  const tabItems = [
    {
      key: '1',
      label: <span className="flex flex-col lg:flex-row">Description</span>,
      children: (
        <div className="text-base px-8 py-4">{proposalDetailData?.proposalDescription}</div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex flex-col lg:flex-row">
          <span>Contract</span>&nbsp; <span>Information</span>
        </span>
      ),
      children: (
        <div className="text-base	px-8 py-4">
          <div className="flex flex-col gap-2 pb-8">
            <div>
              <Typography.Text fontWeight={FontWeightEnum.Medium}>Contract Name</Typography.Text>
            </div>
            <div>
              <Typography.Text className="text-Neutral-Secondary-Text">
                {proposalDetailData?.transaction?.contractMethodName ?? '-'}
              </Typography.Text>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-8">
            <div>
              <Typography.Text fontWeight={FontWeightEnum.Medium}>Contract Address</Typography.Text>
            </div>
            <div>
              <HashAddress address={proposalDetailData?.transaction?.toAddress ?? '-'} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <Typography.Text fontWeight={FontWeightEnum.Medium}>Contract Params</Typography.Text>
            </div>
            <div className="p-4 rounded-md bg-[#F8F8F8]">
              {JSON.stringify(proposalDetailData?.transaction?.params, null, 2)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex flex-col lg:flex-row">
          <span>Organization</span>&nbsp;
          <span>Information</span>
        </span>
      ),
      children: (
        <div className="text-base	px-8 py-4">
          <div className="flex flex-col gap-2 pb-8">
            <div>
              <Typography.Text fontWeight={FontWeightEnum.Medium}>
                Organization Name
              </Typography.Text>
            </div>
            <div>
              <Typography.Text className="text-Neutral-Secondary-Text">
                Organization name 01
              </Typography.Text>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-2">
            <div>
              <Typography.Text fontWeight={FontWeightEnum.Medium}>
                Organization Address
              </Typography.Text>
            </div>
            <div>
              <HashAddress address="JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZS" />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return <Tabs items={tabItems} />;
};
export { ProposalTab };
