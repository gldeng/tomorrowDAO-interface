import { Button, HashAddress, Dropdown } from 'aelf-design';
import Image from 'next/image';
import { Divider, Descriptions, DescriptionsProps } from 'antd';
import type { MenuProps } from 'antd';
import { HC_CANDIDATE, HC_MEMBER } from '../../constants';

import ProposalDetailFile from 'assets/imgs/proposal-detail-file.svg';
import DaoLogo from 'assets/imgs/dao-logo.svg';

import './index.css';
import useJumpByPath from 'hooks/useJumpByPath';

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
    memberCount: number;
    candidateCount: number;
    fileInfoList: Array<{
      cid: string;
      name: string;
      url: string;
    }>;
  };
  onChangeHCParams: any;
}

export default function DaoInfo(props: IParams) {
  const {
    data,
    data: { metadata, fileInfoList = [] },
    onChangeHCParams,
  } = props;

  const jump = useJumpByPath();

  const handleGoto = () => {
    const originAddress = 'ELF_2UthYi7AHRdfrqc1YCfeQnjdChDLaas65bW4WxESMGMojFiXj9_AELF#contracts';
    jump(`https://explorer.aelf.io/address/${originAddress}`);
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Creator',
      children: <HashAddress preLen={8} endLen={11} address={data.creator}></HashAddress>,
    },
    {
      key: '2',
      label: 'Staking Contract',
      children: (
        <HashAddress
          preLen={8}
          endLen={11}
          address={data.creator}
          addressClickCallback={handleGoto}
        ></HashAddress>
      ),
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
          <span
            className="dis-common-span"
            onClick={() => {
              onChangeHCParams(HC_MEMBER);
            }}
          >
            {data.memberCount} Members
          </span>
          <span>17 Days</span>
        </div>
      ),
    },
    {
      key: '6',
      label: 'High Council Candidates:',
      children: (
        <div className="dis-item">
          <span
            className="dis-common-span"
            onClick={() => {
              onChangeHCParams(HC_CANDIDATE);
            }}
          >
            {data.candidateCount} Candidates
          </span>
        </div>
      ),
    },
  ];

  const handleViewPdf = (url: string) => {
    window.open(url);
  };

  const fileItems: MenuProps['items'] = fileInfoList.map((item: any) => {
    return {
      ...item,
      key: item.cid,
      label: (
        <div
          className="min-w-36"
          onClick={() => {
            handleViewPdf(item.url);
          }}
        >
          {item.name}
        </div>
      ),
    };
  });

  return (
    <div className="dao-detail-dis">
      <div className="dao-detail-dis-title">
        <div>
          <Image width={32} height={32} src={DaoLogo} alt="" className="mr-2"></Image>
          <span>{metadata.name}</span>
        </div>
        <Dropdown menu={{ items: fileItems }} placement="bottomRight">
          <div className="bg-Neutral-Default-BG w-28 leading-8 text-center rounded-md">
            <Image className="mr-1" width={14} height={14} src={ProposalDetailFile} alt=""></Image>
            Preview File
          </div>
        </Dropdown>
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
