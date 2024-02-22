import { Button, HashAddress } from 'aelf-design';
import Image from 'next/image';
import { Divider, Descriptions, DescriptionsProps } from 'antd';
import ProposalDetailFile from 'assets/imgs/proposal-detail-file.svg';
import DaoLogo from 'assets/imgs/dao-logo.svg';

import './index.css';

interface IParams {
  data: {
    metadata: {
      name: string;
      description: string;
    };
    creator: string;
    governanceToken: string;
    network: string;
    governanceModel: string;
  };
}

export default function DaoInfo(props: IParams) {
  const {
    data,
    data: { metadata },
  } = props;
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Creator',
      children: <HashAddress preLen={8} endLen={11} address={data.creator}></HashAddress>,
    },
    {
      key: '2',
      label: 'Staking Contract',
      children: <HashAddress preLen={8} endLen={11} address={data.creator}></HashAddress>,
    },
    {
      key: '3',
      label: 'Governance Token',
      children: data.governanceToken,
    },
    {
      key: '4',
      label: 'Governance Model',
      children: data.governanceModel,
    },
    {
      key: '5',
      label: 'High Council',
      children: (
        <div className="dis-item">
          <span className="dis-common-span">17 Members</span>
          <span>17 Days</span>
        </div>
      ),
    },
    {
      key: '6',
      label: 'High Council Candidates:',
      children: (
        <div className="dis-item">
          <span className="dis-common-span">17 Members</span>
          <span>17 Days</span>
        </div>
      ),
    },
  ];

  return (
    <div className="dao-detail-dis">
      <div className="dao-detail-dis-title">
        <div>
          <Image width={32} height={32} src={DaoLogo} alt="" className="mr-2"></Image>
          <span>{metadata.name}</span>
        </div>
        <Button icon={<Image width={14} height={14} src={ProposalDetailFile} alt=""></Image>}>
          Preview File
        </Button>
      </div>
      <div className="dao-detail-dis-dis">{metadata.description}</div>
      <Divider />
      <Descriptions
        title="Creator"
        items={items}
        column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
      />
    </div>
  );
}
