import { Collapse, HashAddress, Typography } from 'aelf-design';
import Image from 'next/image';
import { Divider, Descriptions, DescriptionsProps } from 'antd';
import useResponsive from 'hooks/useResponsive';
import PreviewFile from 'components/PreviewFile';
import { IDaoDetail } from '../../type';

import { HC_CANDIDATE, HC_MEMBER } from '../../constants';

import DaoLogo from 'assets/imgs/dao-logo.svg';

import './index.css';
import useJumpByPath from 'hooks/useJumpByPath';

interface IParams {
  data: IDaoDetail;
  onChangeHCParams: any;
}

export default function DaoInfo(props: IParams) {
  const {
    data,
    data: { metadata, fileInfoList },
    onChangeHCParams,
  } = props;

  const jump = useJumpByPath();
  const { isLG } = useResponsive();

  const handleGoto = () => {
    const originAddress = 'ELF_2UthYi7AHRdfrqc1YCfeQnjdChDLaas65bW4WxESMGMojFiXj9_AELF#contracts';
    jump(`https://explorer.aelf.io/address/${originAddress}`);
  };

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Creator',
      children: (
        <HashAddress
          className="address"
          preLen={8}
          endLen={11}
          address={data.creator}
        ></HashAddress>
      ),
    },
    {
      key: '2',
      label: 'Staking Contract',
      children: (
        <HashAddress
          preLen={8}
          endLen={11}
          className="address"
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

  return (
    <div className="dao-detail-dis">
      <div className="dao-detail-dis-title px-4 lg:px-8">
        <div className="md:flex md:items-center">
          <Image width={32} height={32} src={DaoLogo} alt="" className="mr-2"></Image>
          <Typography.Title level={5}>{metadata.name}</Typography.Title>
        </div>
        <PreviewFile list={fileInfoList} />
      </div>
      <div className="dao-detail-dis-dis px-4 lg:px-8">{metadata.description}</div>
      <Divider className="mb-2 lg:mb-6" />
      <Collapse defaultActiveKey={['1']} ghost>
        <Collapse.Panel header={<Typography.Title>Creator</Typography.Title>} key="1">
          <Descriptions
            layout={isLG ? 'vertical' : 'horizontal'}
            items={items}
            column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
          />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
